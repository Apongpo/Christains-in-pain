/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    const stories = app.findCollectionByNameOrId('story_submissions');
    const topic = stories.fields.getByName('topic');
    topic.values = ['Chronic illness/disease', 'Mental health', 'Faith and doubt', 'New diagnosis', 'Other'];
    app.save(stories);

    const contacts = app.findCollectionByNameOrId('support_contacts');
    const interest = contacts.fields.getByName('interest');
    interest.values = ['Join a peer support session', 'One-on-one support', 'General question'];
    app.save(contacts);
  },
  (app) => {
    const stories = app.findCollectionByNameOrId('story_submissions');
    const topic = stories.fields.getByName('topic');
    topic.values = ['Chronic illness', 'Mental health', 'Grief & loss', 'New diagnosis', 'Caregiving', 'Faith & doubt', 'Other'];
    app.save(stories);

    const contacts = app.findCollectionByNameOrId('support_contacts');
    const interest = contacts.fields.getByName('interest');
    interest.values = ['Join the community', 'Volunteer / lead a session', 'Plan a visit', 'Join a peer support session', 'One-on-one support', 'Baptism', 'Partner / give', 'General question'];
    app.save(contacts);
  },
);
