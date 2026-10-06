const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const hook = readFileSync(path.join(__dirname, '..', 'pb_hooks', 'contact-mail.pb.js'), 'utf8');
const builderHook = readFileSync(path.join(__dirname, '..', 'pb_hooks', 'builder-mailer.pb.js'), 'utf8');

const form = {
    name: 'Test visitor',
    email: 'visitor@example.com',
    phone: '',
    interest: 'General question',
    message: 'Please help.\nThis is a second line.',
};

function setup({ smtp = true, env = {}, invalid = false, mailFailure = false, saveFailure = false } = {}) {
    let route;
    const records = [];
    const messages = [];
    const errors = [];
    class ApiError extends Error {
        constructor(status, message) {
            super(message);
            this.status = status;
        }
    }
    class BadRequestError extends ApiError {
        constructor(message) {
            super(400, message);
        }
    }
    const app = {
        settings: () => ({
            smtp: { enabled: smtp },
            meta: { senderAddress: 'sender@example.com', senderName: 'Christians In Pain' },
        }),
        logger: () => ({ error: (...args) => errors.push(args) }),
        findCollectionByNameOrId: (name) => {
            assert.equal(name, 'support_contacts');
            return { name };
        },
        validate: () => {
            if (invalid) throw new Error('Invalid email');
        },
        save: (record) => {
            if (saveFailure) throw new Error('Database unavailable');
            records.push(record);
        },
        newMailClient: () => ({
            send: (message) => {
                if (mailFailure) throw new Error('SMTP unavailable');
                messages.push(message);
            },
        }),
        runInTransaction: (callback) => {
            const count = records.length;
            try {
                callback(app);
            } catch (error) {
                records.splice(count);
                throw error;
            }
        },
    };
    vm.runInNewContext(hook, {
        routerAdd: (method, url, callback) => {
            assert.equal(method, 'POST');
            assert.ok(['/api/contact', '/api/story'].includes(url));
            route = callback;
        },
        Record: class {
            constructor() { this.fields = {}; }
            set(key, value) { this.fields[key] = value; }
            getString(key) { return this.fields[key]; }
            getBool(key) { return this.fields[key]; }
        },
        MailerMessage: class { constructor(message) { Object.assign(this, message); } },
        ApiError,
        BadRequestError,
        $os: { getenv: (key) => env[key] || '' },
    });
    return {
        records, messages, errors,
        submit: (body = form) => route({
            app,
            request: { url: { path: '/api/contact' } },
            requestInfo: () => ({ body }),
            json: (status, body) => ({ status, body }),
        }),
    };
}

test('saves and emails contact messages with a fixed recipient and visitor Reply-To', () => {
    const run = setup();
    const response = run.submit({ ...form, to: 'attacker@example.com', session: 'Private Peer Prayer Call' });
    assert.equal(response.status, 200);
    assert.equal(run.records.length, 1);
    assert.equal(run.records[0].fields.session, 'Private Peer Prayer Call');
    const message = run.messages[0];
    assert.equal(message.to[0].address, 'christiansinpain@gmail.com');
    assert.equal(message.from.address, 'sender@example.com');
    assert.equal(message.headers['Reply-To'], form.email);
    for (const value of [form.name, form.email, form.interest, form.message]) {
        assert.ok(message.text.includes(value));
    }
    assert.ok(message.text.includes('Not provided'));
    assert.equal(message.html, undefined);
});

test('fails explicitly without a configured sender and does not save', () => {
    const run = setup({ smtp: false });
    assert.throws(() => run.submit(), { status: 503 });
    assert.equal(run.records.length, 0);
    assert.equal(run.messages.length, 0);
    assert.equal(run.errors.length, 1);
});

test('accepts a fully configured Hostinger mailer without SMTP', () => {
    const run = setup({
        smtp: false,
        env: {
            BUILDER_MAILER_API_URL: 'https://mailer.example.com',
            BUILDER_MAILER_API_KEY: 'test-only',
            BUILDER_MAILER_SENDER_ADDRESS: 'sender@example.com',
        },
    });
    assert.equal(run.submit().status, 200);
    assert.equal(run.messages.length, 1);
});

test('rejects partial mail configuration', () => {
    const run = setup({ smtp: false, env: { BUILDER_MAILER_API_URL: 'https://mailer.example.com' } });
    assert.throws(() => run.submit(), { status: 503 });
});

test('rejects non-string inputs before sending or saving', () => {
    const run = setup();
    assert.throws(() => run.submit({ ...form, email: ['visitor@example.com'] }), { status: 400 });
    assert.equal(run.records.length, 0);
    assert.equal(run.messages.length, 0);
});

test('validates through PocketBase before saving or emailing', () => {
    const run = setup({ invalid: true });
    assert.throws(() => run.submit(), { status: 400 });
    assert.equal(run.records.length, 0);
    assert.equal(run.messages.length, 0);
});

test('rolls back the contact and logs a mail failure without showing success', () => {
    const run = setup({ mailFailure: true });
    assert.throws(() => run.submit(), { status: 502 });
    assert.equal(run.records.length, 0);
    assert.equal(run.messages.length, 0);
    assert.equal(run.errors.length, 1);
});

test('does not disguise database failures as validation errors or send mail', () => {
    const run = setup({ saveFailure: true });
    assert.throws(() => run.submit(), { message: 'Database unavailable' });
    assert.equal(run.messages.length, 0);
});

test('Hostinger mailer preserves Reply-To and falls back to the sender for other mail', () => {
    let handler;
    const payloads = [];
    vm.runInNewContext(builderHook, {
        onMailerSend: (callback) => { handler = callback; },
        $os: { getenv: (key) => key === 'BUILDER_MAILER_SENDER_ADDRESS' ? 'sender@example.com' : 'test-only' },
        $http: { send: (request) => {
            payloads.push(JSON.parse(request.body));
            return { statusCode: 200 };
        } },
    });
    const message = {
        subject: 'Test', text: 'Hello', from: { name: 'Support' },
        to: [{ address: 'christiansinpain@gmail.com' }],
        headers: { 'Reply-To': 'visitor@example.com' },
    };
    const app = { settings: () => ({ smtp: { enabled: false } }) };
    handler({ app, message });
    handler({ app, message: { ...message, headers: {} } });
    assert.equal(payloads[0].replyTo, 'visitor@example.com');
    assert.equal(payloads[1].replyTo, 'sender@example.com');
});

test('Hostinger hook delegates to PocketBase when SMTP is enabled', () => {
    let handler;
    let called = false;
    vm.runInNewContext(builderHook, { onMailerSend: (callback) => { handler = callback; } });
    handler({
        app: { settings: () => ({ smtp: { enabled: true } }) },
        next: () => { called = true; },
    });
    assert.equal(called, true);
});
