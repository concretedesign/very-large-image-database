Meteor.subscribe('images');

Template.all_images.helpers({
  images: function () {
    var activeTags = Session.get('activeTags') ? Session.get('activeTags').split(',') : [];

    if (activeTags.length) {
      return Images.find({ categories: { $all: activeTags } })
    } else {
      return Images.find();
    }
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
