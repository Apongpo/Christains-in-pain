/// <reference path="../pb_data/types.d.ts" />
routerAdd('POST', '/api/contact', (e) => {
    const body = e.requestInfo().body;
    const fields = ['name', 'email', 'phone', 'interest', 'message'];
    for (const field of fields) {
        if (body[field] !== undefined && typeof body[field] !== 'string') {
            throw new BadRequestError('Please check your contact details.');
        }
    }

    const settings = e.app.settings();
    if (!settings.smtp.enabled && !(
        $os.getenv('BUILDER_MAILER_API_URL') &&
        $os.getenv('BUILDER_MAILER_API_KEY') &&
        $os.getenv('BUILDER_MAILER_SENDER_ADDRESS')
    )) {
        e.app.logger().error('Contact email service is not configured');
        throw new ApiError(503, 'Email is temporarily unavailable. Please email christiansinpain@gmail.com directly.');
    }

    e.app.runInTransaction((txApp) => {
        const record = new Record(txApp.findCollectionByNameOrId('support_contacts'));
        for (const field of fields) {
            record.set(field, body[field] || '');
        }
        try {
            txApp.validate(record);
        } catch (error) {
            throw new BadRequestError('Please check your contact details.', error);
        }
        txApp.save(record);

        const message = new MailerMessage({
            from: {
                address: settings.meta.senderAddress,
                name: settings.meta.senderName,
            },
            to: [{ address: 'christiansinpain@gmail.com' }],
            subject: 'New contact message - Christians In Pain',
            text: [
                'A visitor sent a message through the contact page.',
                '',
                `Name: ${record.getString('name')}`,
                `Email: ${record.getString('email')}`,
                `Phone: ${record.getString('phone') || 'Not provided'}`,
                `Interest: ${record.getString('interest')}`,
                '',
                'Message:',
                record.getString('message'),
            ].join('\n'),
            headers: { 'Reply-To': record.getString('email') },
        });

        try {
            txApp.newMailClient().send(message);
        } catch (error) {
            txApp.logger().error('Contact email delivery failed', 'error', String(error));
            // Throwing rolls back the saved contact so a retry does not create a duplicate.
            throw new ApiError(502, 'We could not send your message. Please try again or email christiansinpain@gmail.com directly.');
        }
    });

    return e.json(200, { message: 'Message sent.' });
});
