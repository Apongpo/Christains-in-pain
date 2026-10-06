const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const { setTimeout: delay } = require('node:timers/promises');

test('PocketBase sends contact mail, validates input and rolls back SMTP failures', { timeout: 60000 }, async () => {
    const root = path.resolve(__dirname, '..');
    const executable = path.join(root, process.platform === 'win32' ? 'pocketbase.exe' : 'pocketbase');
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'cip-contact-mail-test-'));
    const messages = [];
    let rejectMail = false;
    let child;
    let output = '';
    const smtp = net.createServer((socket) => {
        socket.setEncoding('utf8');
        socket.write('220 localhost test SMTP\r\n');
        let buffer = '';
        let data = false;
        socket.on('data', (chunk) => {
            buffer += chunk;
            while (true) {
                if (data) {
                    const end = buffer.indexOf('\r\n.\r\n');
                    if (end < 0) break;
                    messages.push(buffer.slice(0, end));
                    buffer = buffer.slice(end + 5);
                    data = false;
                    socket.write('250 Accepted\r\n');
                } else {
                    const end = buffer.indexOf('\r\n');
                    if (end < 0) break;
                    const command = buffer.slice(0, end);
                    buffer = buffer.slice(end + 2);
                    if (/^(EHLO|HELO) /i.test(command)) socket.write('250 localhost\r\n');
                    else if (/^MAIL FROM:/i.test(command)) socket.write(rejectMail ? '550 Test rejection\r\n' : '250 OK\r\n');
                    else if (/^RCPT TO:/i.test(command)) {
                        assert.match(command, /christiansinpain@gmail\.com/i);
                        socket.write('250 OK\r\n');
                    } else if (/^DATA$/i.test(command)) {
                        data = true;
                        socket.write('354 End with a dot\r\n');
                    } else if (/^QUIT$/i.test(command)) socket.end('221 Goodbye\r\n');
                    else socket.write('250 OK\r\n');
                }
            }
        });
        socket.on('error', () => socket.destroy());
    });
    try {
        smtp.listen(0, '127.0.0.1');
        await once(smtp, 'listening');
        const portProbe = net.createServer();
        portProbe.listen(0, '127.0.0.1');
        await once(portProbe, 'listening');
        const port = portProbe.address().port;
        await new Promise((resolve) => portProbe.close(resolve));

        const hooks = path.join(temp, 'hooks');
        const migrations = path.join(temp, 'migrations');
        fs.mkdirSync(hooks);
        fs.mkdirSync(migrations);
        for (const name of ['contact-mail.pb.js', 'builder-mailer.pb.js']) {
            fs.copyFileSync(path.join(root, 'pb_hooks', name), path.join(hooks, name));
        }
        fs.copyFileSync(
            path.join(root, 'pb_migrations', '1787148000_create_support_collections.js'),
            path.join(migrations, '1787148000_create_support_collections.js'),
        );
        fs.copyFileSync(
            path.join(root, 'pb_migrations', '1791270600_limit_contact_email_requests.js'),
            path.join(migrations, '1791270600_limit_contact_email_requests.js'),
        );
        fs.writeFileSync(path.join(migrations, '1791270601_test_mail_settings.js'), `
            migrate((app) => {
                const settings = app.settings();
                settings.smtp.enabled = true;
                settings.smtp.host = "127.0.0.1";
                settings.smtp.port = ${smtp.address().port};
                settings.smtp.tls = false;
                settings.meta.senderAddress = "sender@example.com";
                settings.meta.senderName = "Christians In Pain";
                settings.rateLimits.enabled = true;
                app.save(settings);
            });
        `);
        child = spawn(executable, [
            'serve', `--http=127.0.0.1:${port}`,
            `--dir=${path.join(temp, 'data')}`, `--hooksDir=${hooks}`,
            `--migrationsDir=${migrations}`, '--hooksWatch=false',
        ], { stdio: ['ignore', 'pipe', 'pipe'] });
        child.stdout.on('data', (chunk) => { output += chunk; });
        child.stderr.on('data', (chunk) => { output += chunk; });
        child.on('error', (error) => { output += error.message; });
        const base = `http://127.0.0.1:${port}`;
        let ready = false;
        for (let i = 0; i < 100; i++) {
            try {
                const response = await fetch(`${base}/api/health`);
                if (response.ok) { ready = true; break; }
            } catch (error) {
                if (child.exitCode !== null) throw new Error(`PocketBase failed: ${output}`, { cause: error });
            }
            await delay(100);
        }
        assert.ok(ready, output);
        const form = {
            name: 'Integration test',
            email: 'visitor@example.com',
            interest: 'General question',
            message: 'Test message <not HTML>.',
        };
        const submit = (body) => fetch(`${base}/api/contact`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        let response = await submit({ ...form, email: 'invalid\r\nBcc: attacker@example.com' });
        assert.equal(response.status, 400, await response.text());
        assert.equal(messages.length, 0);
        response = await submit(form);
        assert.equal(response.status, 200, await response.text());
        assert.equal(messages.length, 1);
        assert.match(messages[0], /Reply-To: visitor@example\.com/i);
        assert.match(messages[0], /Test message <not HTML>/);
        rejectMail = true;
        response = await submit({ ...form, message: 'Must roll back' });
        assert.equal(response.status, 502, await response.text());
        assert.equal(messages.length, 1);
        for (let i = 0; i < 2; i++) {
            response = await submit(form);
            assert.equal(response.status, 502, await response.text());
        }
        response = await submit(form);
        assert.equal(response.status, 429, await response.text());

        const { DatabaseSync } = require('node:sqlite');
        const db = new DatabaseSync(path.join(temp, 'data', 'data.db'), { readOnly: true });
        try {
            assert.equal(db.prepare('SELECT COUNT(*) AS count FROM support_contacts').get().count, 1);
            assert.equal(db.prepare('SELECT message FROM support_contacts').get().message, form.message);
        } finally {
            db.close();
        }
    } finally {
        if (child && child.exitCode === null) {
            const exit = once(child, 'exit');
            child.kill();
            await exit;
        }
        await new Promise((resolve) => smtp.close(resolve));
        fs.rmSync(temp, { recursive: true, force: true });
    }
});
