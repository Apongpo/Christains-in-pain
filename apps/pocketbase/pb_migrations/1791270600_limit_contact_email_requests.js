/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    const settings = app.settings();
    settings.rateLimits.rules.push({
        label: 'POST /api/contact',
        audience: '',
        duration: 60 * 60,
        maxRequests: 5,
    });
    app.save(settings);
}, (app) => {
    const settings = app.settings();
    settings.rateLimits.rules = settings.rateLimits.rules.filter(
        (rule) => rule.label !== 'POST /api/contact',
    );
    app.save(settings);
});
