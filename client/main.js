Images = new Mongo.Collection("images");

Meteor.startup(function () {
  Session.setDefault('activeTags', '');
  Session.setDefault('collection', '');
  Session.setDefault('collectionOpen', false);
  Session.setDefault('imageSkip', 0);
});

UI.registerHelper('escapePath', function (path) {
    return encodeURIComponent(path);
});
