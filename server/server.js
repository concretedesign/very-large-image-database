Images = new Mongo.Collection("images");

Meteor.publish('images', function () {
  return Images.find({}, {sort: { date: -1 }});
})

Meteor.startup(function () {
  var subdirectories = Meteor.settings.public.imgdir.split('/').length;
  var watcher = chokidar.watch(Meteor.settings.public.imgdir, {
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

      console.log('adding ' + path);
      Images.insert({
        path: imagePath,
        filename: filename,
        categories: categories,
        date: new Date(),
        usePolling: true // FIXME: Probably need to set to false when running on server
      });
    }))
    .on('unlink', Meteor.bindEnvironment(function (path) {
      var exploded = path.split('/');
      var imagePath = exploded.slice(subdirectories, exploded.length).join('/');
      var image = Images.findOne({ path: imagePath });
      if (!image) {
        return false;
      }
      console.log('removing ' + path);
      Images.remove(image._id);
    }));
});

Meteor.methods({
  'rescan': function () {
    var subdirectories = Meteor.settings.public.imgdir.split('/').length;

    function walk(currentDirPath, callback) {
      var fs = Npm.require('fs'), path = Npm.require('path');
      fs.readdirSync(currentDirPath).forEach(function(name) {
          var filePath = path.join(currentDirPath, name);
          var stat = fs.statSync(filePath);
          if (stat.isFile()) {
              callback(filePath, stat);
          } else if (stat.isDirectory()) {
              walk(filePath, callback);
          }
      });
    }

    function checkURL(url) {
      return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }

    Images.remove({});

    walk(Meteor.settings.public.imgdir, function(path, stat) {
      if (checkURL(path)) {
        var exploded = path.split('/');
        var imagePath = exploded.slice(subdirectories, exploded.length).join('/');
        var categories = exploded.slice(subdirectories, exploded.length - 1);
        var filename = exploded[exploded.length - 1];

        Images.insert({
          path: imagePath,
          filename: filename,
          categories: categories,
          date: new Date()
        });
      }
    });
  }
})
