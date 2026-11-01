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

test('stores contact form in D1 without an email service', async () => {
    const env = createEnv();
    const response = await handleContactSubmission(request('contact', contact), env, 'contact');

    assert.equal(response.status, 200);
    assert.equal(env.DB.rows.support_contacts.size, 1);
    assert.deepEqual(await response.json(), { message: 'Your submission has been saved.' });
});

test('stores private story details in D1 without an email service', async () => {
    const env = createEnv();
    const response = await handleContactSubmission(request('story', story), env, 'story');

    assert.equal(response.status, 200);
    assert.equal(env.DB.rows.story_submissions.size, 1);
    const savedStory = env.DB.rows.story_submissions.values().next().value;
    assert.equal(savedStory[6], 0);
    assert.equal(savedStory[7], 1);
});

test('rejects invalid submissions without writing to D1', async () => {
    const env = createEnv();
    const response = await handleContactSubmission(
        request('contact', { ...contact, email: 'not-an-email' }),
        env,
        'contact',
    );

    assert.equal(response.status, 400);
    assert.equal(env.DB.rows.support_contacts.size, 0);
});

test('limits each endpoint to five submissions per IP per hour', async () => {
    const env = createEnv();

    for (let attempt = 0; attempt < 5; attempt++) {
        const response = await handleContactSubmission(request('contact', contact), env, 'contact');
        assert.equal(response.status, 200);
    }
    const limited = await handleContactSubmission(request('contact', contact), env, 'contact');

    assert.equal(limited.status, 429);
    assert.equal(env.DB.rows.support_contacts.size, 5);
});

test('reports rate-limit configuration errors without accepting a submission', async () => {
    const env = createEnv();
    delete env.RATE_LIMIT_SECRET;

    const response = await handleContactSubmission(request('contact', contact), env, 'contact');

    assert.equal(response.status, 503);
    assert.equal(env.DB.rows.support_contacts.size, 0);
});

test('reports database write errors without returning success', async () => {
    const env = createEnv();
    env.DB.failWrites = true;

    const response = await handleContactSubmission(request('contact', contact), env, 'contact');

    assert.equal(response.status, 503);
    assert.equal(env.DB.rows.support_contacts.size, 0);
});
