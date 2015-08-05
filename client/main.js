Images = new Mongo.Collection("images");

Meteor.startup(function () {
  Session.setDefault('activeTags', '');
  Session.setDefault('collection', '');
  Session.setDefault('collectionOpen', false);
});
