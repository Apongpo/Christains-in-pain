/// <reference path="../pb_data/types.d.ts" />
migrate(
    (app) => {
        // Share Your Story / Prayer Request submissions (no login)
        const stories = new Collection({
            name: 'story_submissions',
            type: 'base',
            listRule: null,
            viewRule: null,
            createRule: '',
            updateRule: null,
            deleteRule: null,
            fields: [
                { name: 'name', type: 'text', required: true, max: 120 },
                { name: 'email', type: 'email', required: false },
                { name: 'topic', type: 'select', required: true, maxSelect: 1, values: ['Chronic illness', 'Mental health', 'Grief & loss', 'New diagnosis', 'Caregiving', 'Faith & doubt', 'Other'] },
                { name: 'support_type', type: 'select', required: true, maxSelect: 1, values: ['Prayer', 'Peer support', 'Both', 'Just want to share'] },
                { name: 'story', type: 'text', required: true, max: 5000 },
                { name: 'want_followup', type: 'bool', required: false },
                { name: 'is_private', type: 'bool', required: false },
                { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
            ],
        });
        app.save(stories);

        // Contact / Join / Session sign-up submissions (no login)
        const contacts = new Collection({
            name: 'support_contacts',
            type: 'base',
            listRule: null,
            viewRule: null,
            createRule: '',
            updateRule: null,
            deleteRule: null,
            fields: [
                { name: 'name', type: 'text', required: true, max: 120 },
                { name: 'email', type: 'email', required: true },
                { name: 'phone', type: 'text', required: false, max: 40 },
                { name: 'interest', type: 'select', required: true, maxSelect: 1, values: ['Join the community', 'Volunteer / lead a session', 'Plan a visit', 'Join a peer support session', 'One-on-one support', 'Baptism', 'Partner / give', 'General question'] },
                { name: 'session', type: 'text', required: false, max: 200 },
                { name: 'message', type: 'text', required: true, max: 3000 },
                { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
            ],
        });
        app.save(contacts);
    },
    (app) => {
        ['story_submissions', 'support_contacts'].forEach((name) => {
            try {
                app.delete(app.findCollectionByNameOrId(name));
            } catch (_) {
                // already removed
            }
        });
    },
);
