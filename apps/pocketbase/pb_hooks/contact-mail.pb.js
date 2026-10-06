/// <reference path="../pb_data/types.d.ts" />
const handleSubmission = (e) => {
    const isStory = e.request.url.path === '/api/story';
    const body = e.requestInfo().body;
    const fields = isStory
        ? ['name', 'email', 'topic', 'support_type', 'story']
        : ['name', 'email', 'phone', 'interest', 'message', 'session'];
    for (const field of fields) {
        if (body[field] !== undefined && typeof body[field] !== 'string') {
            throw new BadRequestError('Please check your contact details.');
        }
    }
    if (isStory) {
        for (const field of ['want_followup', 'is_private']) {
            if (body[field] !== undefined && typeof body[field] !== 'boolean') {
                throw new BadRequestError('Please check your story preferences.');
            }
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
        const record = new Record(txApp.findCollectionByNameOrId(isStory ? 'story_submissions' : 'support_contacts'));
        for (const field of fields) {
            record.set(field, body[field] || '');
        }
        if (isStory) {
            record.set('want_followup', body.want_followup ?? false);
            record.set('is_private', body.is_private ?? true);
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
            subject: isStory
                ? 'New story / prayer request - Christians In Pain'
                : record.getString('session')
                    ? 'New peer support session request - Christians In Pain'
                    : 'New contact message - Christians In Pain',
            text: (isStory ? [
                'A visitor shared a story or prayer request.',
                '',
                `Name: ${record.getString('name')}`,
                `Email: ${record.getString('email') || 'Not provided'}`,
                `Topic: ${record.getString('topic')}`,
                `Support requested: ${record.getString('support_type')}`,
                `Follow-up requested: ${record.getBool('want_followup') ? 'Yes' : 'No'}`,
                `Private: ${record.getBool('is_private') ? 'Yes - do not share publicly' : 'Not marked private - seek permission before sharing'}`,
                '',
                'Story / prayer request:',
                record.getString('story'),
            ] : [
                record.getString('session')
                    ? 'A visitor requested a peer support session.'
                    : 'A visitor sent a message through the contact page.',
                '',
                `Name: ${record.getString('name')}`,
                `Email: ${record.getString('email')}`,
                `Phone: ${record.getString('phone') || 'Not provided'}`,
                `Interest: ${record.getString('interest')}`,
                `Session: ${record.getString('session') || 'Not requested'}`,
                '',
                'Message:',
                record.getString('message'),
            ]).join('\n'),
            headers: record.getString('email') ? { 'Reply-To': record.getString('email') } : {},
        });

        try {
            txApp.newMailClient().send(message);
        } catch (error) {
            txApp.logger().error('Contact email delivery failed', 'error', String(error));
            // Throwing rolls back the submission so a retry does not create a duplicate.
            throw new ApiError(502, 'We could not send your message. Please try again or email christiansinpain@gmail.com directly.');
        }
    });

    return e.json(200, { message: 'Message sent.' });
};

routerAdd('POST', '/api/contact', handleSubmission);
routerAdd('POST', '/api/story', handleSubmission);
