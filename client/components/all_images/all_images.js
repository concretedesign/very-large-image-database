Meteor.subscribe('images');

// How many images we show on one page
const imageLimit = 60;

UI.registerHelper('escapePath', function(path) {
  return encodeURIComponent(path);
});

Template.all_images.helpers({
  images: function () {
    var activeTags = Session.get('activeTags') ? Session.get('activeTags').split(',') : [];
    var imageSkip = Session.get('imageSkip') ? Session.get('imageSkip') : 0;

    if (activeTags.length) {
      return Images.find({ categories: { $all: activeTags } }, { skip: imageSkip * imageLimit, limit: imageLimit })
    } else {
      return Images.find({}, { skip: imageSkip * imageLimit, limit: imageLimit });
    }
  },
  isPastFirstPage: function () {
    return Session.get('imageSkip') > 0;
  },
  hasNextPage: function () {
    var activeTags = Session.get('activeTags') ? Session.get('activeTags').split(',') : [];

    var count = 0;
    if (activeTags.length) {
      count = Images.find({ categories: { $all: activeTags } }).count();
    } else {
      count = Images.find().count();
    }

    return Session.get('imageSkip') < count;
  }
});

Template.all_images.events({
  'click .open': function (e) {
    var win = window.open('/imagebank/' + this.path, '_blank');
    win.focus();
  },
  'click .save': function (e) {
    var currentCollection = Session.get('collection') ? Session.get('collection').split(',') : [];
    if (currentCollection.indexOf(this.path) < 0) {
      currentCollection.push(this.path);
    }
    Session.set('collection', currentCollection.join(','));
  },
  'click .back-button': function (e) {
    var currentPage = Session.get('imageSkip');
    Session.set('imageSkip', Math.max(0, currentPage - 1));

    $('html, body').animate({
      scrollTop: "0px"
    }, 300);
  },
  'click .next-button': function (e) {
    var currentPage = Session.get('imageSkip');
    Session.set('imageSkip', currentPage + 1);

    $('html, body').animate({
      scrollTop: "0px"
    }, 300);
  }
});
