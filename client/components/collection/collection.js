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
  'click .collection-clear': function (e) {
    Session.set('collection', '');
  },
  'click .collection-download': function (e) {
    var currentCollection = Session.get('collection') ? Session.get('collection').split(',') : []

    if (!currentCollection.length) {
      return false;
    }

    downloadAllImages(currentCollection);
  },
  'click .remove-image': function (e) {
    var currentCollection = Session.get('collection') ? Session.get('collection').split(',') : [];
    var newCollection = _.without(currentCollection, this.valueOf());
    Session.set('collection', newCollection.join(','));
  }
});


function downloadAllImages (imgLinks) {
  var zip = new JSZip();
  var deferreds = [];
  for(var i = 0; i < imgLinks.length; i++) {
    deferreds.push(addToZip(zip, imgLinks[i], i));
  }
  $.when.apply(window, deferreds).done(generateZip);
}

function generateZip (zip) {
  var content = zip.generate({type:"blob"});
  var d = new Date()
	var timestamp = d.getUTCFullYear()+'-'+(d.getMonth() + 1)+'-'+d.getDate()+'_'+d.getHours()+'-'+d.getMinutes()
  saveAs(content, 'concrete-images-' + timestamp + '.zip');
}

function addToZip (zip, imgLink, i) {
  var deferred = $.Deferred();
  JSZipUtils.getBinaryContent('/imagebank/' + imgLink, function (err, data) {
    if(err) {
      alert("Problem happened when download img: " + imgLink);
      console.log("Problem happened when download img: " + imgLink);
      deferred.resolve(zip); // ignore this error: just logging
      // deferred.reject(zip); // or we may fail the download
    } else {
      var paths = imgLink.split('/');
      zip.file(paths[paths.length - 1], data, {binary:true});
      deferred.resolve(zip);
    }
  });
  return deferred;
}
