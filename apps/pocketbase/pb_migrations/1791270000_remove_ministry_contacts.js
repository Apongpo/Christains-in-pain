/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
    app.delete(app.findCollectionByNameOrId('ministry_contacts'));
});
