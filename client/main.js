Images = new Mongo.Collection("images");

Meteor.startup(function () {
  Session.setDefault('activeTags', '');
});
