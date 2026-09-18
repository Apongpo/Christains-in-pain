/// <reference path="../pb_data/types.d.ts" />
migrate(
    (app) => {
        const prayer = new Collection({
            name: 'prayer_requests',
            type: 'base',
            listRule: null,
            viewRule: null,
            createRule: '',
            updateRule: null,
            deleteRule: null,
            fields: [
                { name: 'name', type: 'text', required: true, max: 120 },
                { name: 'email', type: 'email', required: false },
                { name: 'category', type: 'select', required: true, maxSelect: 1, values: ['Healing', 'Family', 'Provision', 'Salvation', 'Guidance', 'Thanksgiving', 'Other'] },
                { name: 'request', type: 'text', required: true, max: 3000 },
                { name: 'is_private', type: 'bool', required: false },
                { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
            ],
        });
        app.save(prayer);

        const contact = new Collection({
            name: 'ministry_contacts',
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
                { name: 'interest', type: 'select', required: true, maxSelect: 1, values: ['Join the ministry', 'Volunteer', 'Plan a visit', 'Baptism', 'Partner / give', 'General question'] },
                { name: 'message', type: 'text', required: true, max: 3000 },
                { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
            ],
        });
        app.save(contact);
    },
    (app) => {
        ['prayer_requests', 'ministry_contacts'].forEach((name) => {
            try {
                app.delete(app.findCollectionByNameOrId(name));
            } catch (_) {
                // already removed
            }
        });
    },
);
