Template.collection.helpers({
  collectionCount: function () {
    return Session.get('collection') ? Session.get('collection').split(',').length : 0;
  },
  collection: function () {
    return Session.get('collection') ? Session.get('collection').split(',') : [];
  },
  collectionOpen: function () {
    return Session.get('collectionOpen') ? 'open' : '';
  }
});

Template.collection.events({
  'click .collection-count-closed': function () {
    Session.set('collectionOpen', !Session.get('collectionOpen'));
  },
  'click .collection-count': function () {
    Session.set('collectionOpen', !Session.get('collectionOpen'));
  },
  'click .clear-collection': function (e) {
    Session.set('collection', '');
  },
  'click .download-collection': function (e) {
    // FIXME: This probably needs to be a server method
  },
  'click .remove-image': function (e) {
    var currentCollection = Session.get('collection') ? Session.get('collection').split(',') : [];
    var newCollection = _.without(currentCollection, this.valueOf());
    Session.set('collection', newCollection.join(','));
  }
});
