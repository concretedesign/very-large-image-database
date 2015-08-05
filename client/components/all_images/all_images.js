Meteor.subscribe('images');

Template.all_images.helpers({
  images: function () {
    return Images.find();
  }
});
