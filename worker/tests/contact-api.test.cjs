const assert = require('node:assert/strict');
const { before, test } = require('node:test');

let handleContactSubmission;
before(async () => {
    ({ handleContactSubmission } = await import('../contact-api.mjs'));
});

class TestDatabase {
    constructor() {
        this.rows = { support_contacts: new Map(), story_submissions: new Map() };
        this.rateLimits = new Map();
        this.failWrites = false;
    }

    prepare(sql) {
        return {
            bind: (...values) => ({
                first: async () => {
                    if (sql.includes('INSERT INTO form_rate_limits')) {
                        const [key, windowStart] = values;
                        const current = this.rateLimits.get(key);
                        const count = current?.windowStart === windowStart ? current.count + 1 : 1;
                        this.rateLimits.set(key, { windowStart, count });
                        return { request_count: count };
                    }
                    throw new Error(`Unexpected first() query: ${sql}`);
                },
                run: async () => {
                    if (this.failWrites) throw new Error('D1 unavailable');
                    if (sql.includes('DELETE FROM form_rate_limits')) return {};
                    const insertMatch = sql.match(/INSERT INTO (support_contacts|story_submissions)/);
                    if (insertMatch) {
                        const [id] = values;
                        this.rows[insertMatch[1]].set(id, values);
                        return {};
                    }
                    const deleteMatch = sql.match(/DELETE FROM (support_contacts|story_submissions)/);
                    if (deleteMatch) {
                        this.rows[deleteMatch[1]].delete(values[0]);
                        return {};
                    }
                    throw new Error(`Unexpected run() query: ${sql}`);
                },
            }),
        };
    }
}

function createEnv() {
    return {
        DB: new TestDatabase(),
        RATE_LIMIT_SECRET: 'test-rate-limit-secret',
        BUILDER_MAILER_API_URL: 'https://mailer.example.test',
        BUILDER_MAILER_API_KEY: 'test-mailer-key',
        BUILDER_MAILER_SENDER_ADDRESS: 'sender@example.test',
    };
}

function request(path, body) {
    return new Request(`https://example.test/hcgi/platform/api/${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'CF-Connecting-IP': '192.0.2.10',
        },
        body: JSON.stringify(body),
    });
}

const contact = {
    name: 'Test visitor',
    email: 'visitor@example.test',
    phone: '',
    interest: 'General question',
    message: 'Please help.',
};

const story = {
    name: 'Test visitor',
    email: '',
    topic: 'Mental health',
    support_type: 'Prayer',
    story: 'A private prayer request.',
    want_followup: false,
    is_private: true,
};

test('stores contact form and sends a notification with visitor Reply-To', async (t) => {
    const env = createEnv();
    let payload;
    t.mock.method(globalThis, 'fetch', async (_url, options) => {
        assert.equal(options.headers.Authorization, 'Bearer test-mailer-key');
        payload = JSON.parse(options.body);
        return new Response(null, { status: 200 });
    });

    const response = await handleContactSubmission(request('contact', contact), env, 'contact');

    assert.equal(response.status, 200);
    assert.equal(env.DB.rows.support_contacts.size, 1);
    assert.equal(payload.to, 'christiansinpain@gmail.com');
    assert.equal(payload.replyTo, contact.email);
    assert.match(payload.content.text, /Please help\./);
});

test('stores private story details and notifies the fixed inbox', async (t) => {
    const env = createEnv();
    let payload;
    t.mock.method(globalThis, 'fetch', async (_url, options) => {
        payload = JSON.parse(options.body);
        return new Response(null, { status: 200 });
    });

    const response = await handleContactSubmission(request('story', story), env, 'story');

    assert.equal(response.status, 200);
    assert.equal(env.DB.rows.story_submissions.size, 1);
    assert.equal(payload.replyTo, env.BUILDER_MAILER_SENDER_ADDRESS);
    assert.match(payload.content.text, /Private: Yes - do not share publicly/);
    assert.match(payload.content.text, /A private prayer request\./);
});

test('rejects invalid submissions without writing or sending email', async (t) => {
    const env = createEnv();
    t.mock.method(globalThis, 'fetch', async () => {
        throw new Error('Email must not be sent for invalid submissions');
    });

    const response = await handleContactSubmission(
        request('contact', { ...contact, email: 'not-an-email' }),
        env,
        'contact',
    );

    assert.equal(response.status, 400);
    assert.equal(env.DB.rows.support_contacts.size, 0);
});

test('limits each endpoint to five submissions per IP per hour', async (t) => {
    const env = createEnv();
    t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 200 }));

    for (let attempt = 0; attempt < 5; attempt++) {
        const response = await handleContactSubmission(request('contact', contact), env, 'contact');
        assert.equal(response.status, 200);
    }
    const limited = await handleContactSubmission(request('contact', contact), env, 'contact');

    assert.equal(limited.status, 429);
    assert.equal(env.DB.rows.support_contacts.size, 5);
});

test('removes a saved submission when email notification fails', async (t) => {
    const env = createEnv();
    t.mock.method(globalThis, 'fetch', async () => new Response('Unavailable', { status: 503 }));

    const response = await handleContactSubmission(request('story', story), env, 'story');

    assert.equal(response.status, 502);
    assert.equal(env.DB.rows.story_submissions.size, 0);
});

test('reports missing mail configuration without accepting a submission', async () => {
    const env = createEnv();
    delete env.BUILDER_MAILER_API_KEY;

    const response = await handleContactSubmission(request('contact', contact), env, 'contact');

    assert.equal(response.status, 503);
    assert.equal(env.DB.rows.support_contacts.size, 0);
});
