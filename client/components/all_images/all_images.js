Meteor.subscribe('images');

Template.all_images.helpers({
  images: function () {
    return Images.find();
  }
});

Template.all_images.onRendered(function () {
  // var grid = document.querySelector('.all-images');
  // var iso = new Isotope( grid, {
  //   // options...
  //   itemSelector: '.image',
  //   masonry: {
  //     columnWidth: 200
  //   }
  // });
})
