const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 60 * 60;
const MAX_BODY_BYTES = 24 * 1024;
const CONTACT_INTERESTS = [
    'Join a peer support session',
    'One-on-one support',
    'General question',
];
const STORY_TOPICS = [
    'Chronic illness/disease',
    'Mental health',
    'Faith and doubt',
    'New diagnosis',
    'Other',
];
const STORY_SUPPORT_TYPES = ['Prayer', 'Peer support', 'Both', 'Just want to share'];

const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
        },
    });

function isEmail(value) {
    return typeof value === 'string' &&
        value.length <= 254 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validateText(value, { required = false, max }) {
    return typeof value === 'string' &&
        (!required || value.trim().length > 0) &&
        value.length <= max;
}

async function rateLimit(request, env, route) {
    const secret = env.RATE_LIMIT_SECRET;
    if (!secret) {
        throw new Error('RATE_LIMIT_SECRET is not configured');
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign'],
    );
    const signature = await crypto.subtle.sign(
        'HMAC',
        keyMaterial,
        new TextEncoder().encode(`${route}:${ip}`),
    );
    const rateKey = Array.from(new Uint8Array(signature), (byte) =>
        byte.toString(16).padStart(2, '0'),
    ).join('');
    const windowStart = Math.floor(Date.now() / 1000 / RATE_WINDOW_SECONDS) * RATE_WINDOW_SECONDS;

    await env.DB.prepare('DELETE FROM form_rate_limits WHERE window_start < ?')
        .bind(windowStart - 24 * 60 * 60)
        .run();

    const result = await env.DB.prepare(`
        INSERT INTO form_rate_limits (rate_key, window_start, request_count)
        VALUES (?, ?, 1)
        ON CONFLICT (rate_key) DO UPDATE SET
            window_start = excluded.window_start,
            request_count = CASE
                WHEN form_rate_limits.window_start = excluded.window_start
                THEN form_rate_limits.request_count + 1
                ELSE 1
            END
        RETURNING request_count
    `).bind(rateKey, windowStart).first();

    return result.request_count <= RATE_LIMIT;
}

function parseSubmission(route, body) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return null;
    }

    if (route === 'contact') {
        if (
            !validateText(body.name, { required: true, max: 120 }) ||
            !isEmail(body.email) ||
            !validateText(body.phone ?? '', { max: 40 }) ||
            !CONTACT_INTERESTS.includes(body.interest) ||
            !validateText(body.session ?? '', { max: 200 }) ||
            !validateText(body.message, { required: true, max: 3000 })
        ) {
            return null;
        }

        return {
            name: body.name.trim(),
            email: body.email.trim(),
            phone: (body.phone || '').trim(),
            interest: body.interest,
            session: (body.session || '').trim(),
            message: body.message.trim(),
        };
    }

    if (
        !validateText(body.name, { required: true, max: 120 }) ||
        !(body.email === '' || body.email === undefined || isEmail(body.email)) ||
        !STORY_TOPICS.includes(body.topic) ||
        !STORY_SUPPORT_TYPES.includes(body.support_type) ||
        !validateText(body.story, { required: true, max: 5000 }) ||
        (body.want_followup !== undefined && typeof body.want_followup !== 'boolean') ||
        (body.is_private !== undefined && typeof body.is_private !== 'boolean')
    ) {
        return null;
    }

    return {
        name: body.name.trim(),
        email: (body.email || '').trim(),
        topic: body.topic,
        support_type: body.support_type,
        story: body.story.trim(),
        want_followup: body.want_followup ?? false,
        is_private: body.is_private ?? true,
    };
}

function buildEmail(route, submission, senderAddress) {
    const isStory = route === 'story';
    const session = !isStory ? submission.session : '';
    const subject = isStory
        ? 'New story / prayer request - Christians In Pain'
        : session
            ? 'New peer support session request - Christians In Pain'
            : 'New contact message - Christians In Pain';
    const lines = isStory
        ? [
            'A visitor shared a story or prayer request.',
            '',
            `Name: ${submission.name}`,
            `Email: ${submission.email || 'Not provided'}`,
            `Topic: ${submission.topic}`,
            `Support requested: ${submission.support_type}`,
            `Follow-up requested: ${submission.want_followup ? 'Yes' : 'No'}`,
            `Private: ${submission.is_private ? 'Yes - do not share publicly' : 'Not marked private - seek permission before sharing'}`,
            '',
            'Story / prayer request:',
            submission.story,
        ]
        : [
            session
                ? 'A visitor requested a peer support session.'
                : 'A visitor sent a message through the contact page.',
            '',
            `Name: ${submission.name}`,
            `Email: ${submission.email}`,
            `Phone: ${submission.phone || 'Not provided'}`,
            `Interest: ${submission.interest}`,
            `Session: ${session || 'Not requested'}`,
            '',
            'Message:',
            submission.message,
        ];

    return {
        subject,
        content: { text: lines.join('\n'), type: 'plain' },
        from: senderAddress,
        fromName: 'Christians In Pain',
        replyTo: submission.email || senderAddress,
        to: 'christiansinpain@gmail.com',
    };
}

async function sendEmail(env, payload) {
    if (!env.BUILDER_MAILER_API_URL || !env.BUILDER_MAILER_API_KEY || !env.BUILDER_MAILER_SENDER_ADDRESS) {
        throw new Error('Email service is not configured');
    }

    const authorization = 'Bearer ' + env.BUILDER_MAILER_API_KEY;
    const response = await fetch(
        `${env.BUILDER_MAILER_API_URL.replace(/\/+$/, '')}/api/v2/email`,
        {
            method: 'POST',
            headers: {
                Authorization: authorization,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(10_000),
        },
    );

    if (response.status !== 200) {
        throw new Error(`Email provider returned status ${response.status}`);
    }
}

export async function handleContactSubmission(request, env, route) {
    if (!env.DB) {
        return json({ message: 'Form storage is not configured.' }, 503);
    }
    if (!env.BUILDER_MAILER_API_URL || !env.BUILDER_MAILER_API_KEY || !env.BUILDER_MAILER_SENDER_ADDRESS) {
        return json({ message: 'Email is temporarily unavailable. Please email christiansinpain@gmail.com directly.' }, 503);
    }

    const contentLength = Number(request.headers.get('Content-Length') || 0);
    if (contentLength > MAX_BODY_BYTES) {
        return json({ message: 'Please check your form details.' }, 413);
    }

    let text;
    try {
        text = await request.text();
    } catch (error) {
        console.error('Failed to read form submission:', error);
        return json({ message: 'We could not read your form. Please try again.' }, 400);
    }

    if (new TextEncoder().encode(text).byteLength > MAX_BODY_BYTES) {
        return json({ message: 'Please check your form details.' }, 413);
    }

    let body;
    try {
        body = JSON.parse(text);
    } catch {
        return json({ message: 'Please check your form details.' }, 400);
    }

    const submission = parseSubmission(route, body);
    if (!submission) {
        return json({ message: 'Please check your form details.' }, 400);
    }

    let allowed;
    try {
        allowed = await rateLimit(request, env, route);
    } catch (error) {
        console.error('Form rate limiter failed:', error);
        return json({ message: 'Form submission is temporarily unavailable. Please try again later.' }, 503);
    }
    if (!allowed) {
        return json({ message: 'Too many submissions. Please try again in an hour.' }, 429);
    }

    const id = crypto.randomUUID();
    const created = new Date().toISOString();
    const insert = route === 'story'
        ? env.DB.prepare(`
            INSERT INTO story_submissions
                (id, name, email, topic, support_type, story, want_followup, is_private, created)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            id,
            submission.name,
            submission.email,
            submission.topic,
            submission.support_type,
            submission.story,
            Number(submission.want_followup),
            Number(submission.is_private),
            created,
        )
        : env.DB.prepare(`
            INSERT INTO support_contacts
                (id, name, email, phone, interest, session, message, created)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            id,
            submission.name,
            submission.email,
            submission.phone,
            submission.interest,
            submission.session,
            submission.message,
            created,
        );

    try {
        await insert.run();
    } catch (error) {
        console.error('Failed to store form submission:', error);
        return json({ message: 'We could not save your message. Please try again.' }, 503);
    }

    try {
        await sendEmail(env, buildEmail(route, submission, env.BUILDER_MAILER_SENDER_ADDRESS));
    } catch (error) {
        console.error('Form notification email failed:', error);
        try {
            const table = route === 'story' ? 'story_submissions' : 'support_contacts';
            await env.DB.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
        } catch (rollbackError) {
            console.error('Could not remove submission after email failure:', rollbackError);
        }
        return json({
            message: 'We could not send your message. Please try again or email christiansinpain@gmail.com directly.',
        }, 502);
    }

    return json({ message: 'Message sent.' });
}
