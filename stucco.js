Images = new Mongo.Collection("images");
const subdirectories = 5;

if (Meteor.isServer) {
  Meteor.publish('images', function () {
    return Images.find({}, {sort: { date: -1 }});
  })

  Meteor.startup(function () {
    var watcher = chokidar.watch('/Users/matt/Desktop/pics/', {
      ignored: /[\/\\]\./,
      persistent: true
    });

    watcher
      .on('add', Meteor.bindEnvironment(function (path) {
          var exploded = path.split('/');
          var imagePath = exploded.slice(subdirectories, exploded.length).join('/');
          var categories = exploded.slice(subdirectories, exploded.length - 1);
          var filename = exploded[exploded.length - 1];

          var image = Images.findOne({ path: imagePath });
          if (image) {
            return false;
          }

          Images.insert({
            path: imagePath,
            filename: filename,
            categories: categories,
            date: new Date()
          });
      }))
      .on('change', function (path) { console.log(path, 'has been changed'); })
      .on('unlink', Meteor.bindEnvironment(function (path) {
        var image = Images.findOne({ path: path });
        if (!image) {
          return false;
        }
        Images.remove(image._id);
      }));
  });
}

// ----------------------------------------------------------------------------

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);
  Meteor.subscribe('images');

  Template.all_images.helpers({
    images: function () {
      return Images.find();
    }
  });

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
}
