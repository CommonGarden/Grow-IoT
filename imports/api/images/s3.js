let knox, bound, client, Request, cfdomain, Collections = {};

// https://github.com/VeliovGroup/Meteor-Files/wiki/AWS-S3-Integration

if (Meteor.isServer) {
  // Fix CloudFront certificate issue
  // Read: https://github.com/chilts/awssum/issues/164
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

  knox    = Npm.require('knox');
  Request = Npm.require('request');
  bound = Meteor.bindEnvironment(function(callback) {
    return callback();
  });
  cfdomain = 'https://xxx.cloudfront.net'; // <-- Change to your Cloud Front Domain
  client = knox.createClient({
    key: 'xxx',
    secret: 'yyy',
    bucket: 'zzz',
    region: 'jjj'
  });
}

Collections.files = new FilesCollection({
  debug: false, // Change to `true` for debugging
  throttle: false,
  storagePath: 'assets/app/uploads/uploadedFiles',
  collectionName: 'uploadedFiles',
  allowClientCode: false,
  onAfterUpload: function(fileRef) {
    // In onAfterUpload callback we will move file to AWS:S3
    let self = this;
    _.each(fileRef.versions, function(vRef, version) {
      // We use Random.id() instead of real file's _id 
      // to secure files from reverse engineering
      // As after viewing this code it will be easy
      // to get access to unlisted and protected files
      let filePath = "files/" + (Random.id()) + "-" + version + "." + fileRef.extension;
      client.putFile(vRef.path, filePath, function(error, res) {
        bound(function() {
          let upd;
          if (error) {
            console.error(error);
          } else {
            upd = {
              $set: {}
            };
            upd['$set']["versions." + version + ".meta.pipeFrom"] = cfdomain + '/' + filePath;
            upd['$set']["versions." + version + ".meta.pipePath"] = filePath;
            self.collection.update({
              _id: fileRef._id
            }, upd, function(error) {
              if (error) {
                console.error(error);
              } else {
                // Unlink original files from FS
                // after successful upload to AWS:S3
                self.unlink(self.collection.findOne(fileRef._id), version);
              }
            });
          }
        });
      });
    });
  },
  interceptDownload: function(http, fileRef, version) {
    let path, ref, ref1, ref2;
    path = (ref = fileRef.versions) != null ? (ref1 = ref[version]) != null ? (ref2 = ref1.meta) != null ? ref2.pipeFrom : void 0 : void 0 : void 0;
    if (path) {
      // If file is moved to S3
      // We will pipe request to S3
      // So, original link will stay always secure
      Request({
        url: path,
        headers: _.pick(http.request.headers, 'range', 'accept-language', 'accept', 'cache-control', 'pragma', 'connection', 'upgrade-insecure-requests', 'user-agent')
      }).pipe(http.response);
      return true;
    } else {
      // While file is not yet uploaded to S3
      // We will serve file from FS
      return false;
    }
  }
});

if (Meteor.isServer) {
  // Intercept File's collection remove method
  // to remove file from S3
  let _origRemove = Collections.files.remove;

  Collections.files.remove = function(search) {
    let cursor = this.collection.find(search);
    cursor.forEach(function(fileRef) {
      _.each(fileRef.versions, function(vRef) {
        let ref;
        if (vRef != null ? (ref = vRef.meta) != null ? ref.pipePath : void 0 : void 0) {
          client.deleteFile(vRef.meta.pipePath, function(error) {
            bound(function() {
              if (error) {
                console.error(error);
              }
            });
          });
        }
      });
    });
    // Call original method
    _origRemove.call(this, search);
  };
}