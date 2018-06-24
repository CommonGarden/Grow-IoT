import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';
import { EJSON } from 'meteor/ejson';

Meteor.methods({
    /*
   * Create a new image for a thing
   */
    'Image.new': function (auth, file) {
        check(auth, {
            uuid: String,
            token: String
        });

        // Should be binary...
        check(file, Match.Where(EJSON.isBinary));

        let thing = Things.findOne(auth, {
            fields: {
                _id: 1,
                owner: 1
            }
        });
        if (!thing) { throw new Meteor.Error('unauthorized', 'Unauthorized.'); }

        let imageFile = Buffer.from(file);

        Images.write(imageFile, {
            meta: {
                thing: thing._id,
                insertedAt: new Date(),
                owner: thing.owner,
            },
            type: 'image/jpg',
        }, function (error, fileRef) {
            if (error) {
                throw error;
            } else {
                console.log(fileRef.name + ' is successfully saved to FS. _id: ' + fileRef._id);
                Images.onAfterUpload(fileRef);
            }
        });
    },

    /*
   * Delete an image file.
   */
    'Image.delete': function (id) {
        check(id, String);
        if (!Images.remove({'_id': id})) { throw new Meteor.Error('internal-error', 'Internal error.'); }
    }
});
