Meteor.subscribe('images');

Template.all_tags.helpers({
  selectedTags: function () {
    return Session.get('activeTags') ? Session.get('activeTags').split(',') : [];
  },
  tags: function () {
    var tags = [];
    var images = Images.find({}, { fields: { categories: 1 } }).fetch();
    images.forEach(function (image) {
      tags = tags.concat(image.categories);
    });
    return $.unique(tags);
  },
  tagVisible: function () {
    var currentTags = Session.get('activeTags') ? Session.get('activeTags').split(',') : [];
    return currentTags.indexOf(this.valueOf()) < 0 ? '' : 'selected';
  }
});

Template.all_tags.events({
  'click .selected-tags li': function (e) {
    var currentTags = Session.get('activeTags') ? Session.get('activeTags').split(',') : [];
    var newTags = _.without(currentTags, this.valueOf());
    Session.set('activeTags', newTags.join(','));
  },
  'click .tags li': function (e) {
    var currentTags = Session.get('activeTags') ? Session.get('activeTags').split(',') : [];
    if (currentTags.indexOf(this.valueOf()) < 0) {
      currentTags.push(this.valueOf());
    }
    Session.set('activeTags', currentTags.join(','));
  }
});
