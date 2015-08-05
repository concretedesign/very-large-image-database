Meteor.subscribe('images');

Template.all_tags.helpers({
  tags: function () {
    var tags = [];
    var images = Images.find({}, { fields: { categories: 1 } }).fetch();
    images.forEach(function (image) {
      tags = tags.concat(image.categories);
    });
    return $.unique(tags);
  }
});
