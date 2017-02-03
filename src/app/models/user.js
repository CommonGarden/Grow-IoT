import mongoose from 'mongoose';

import UserPlugin from 'mongoose-meteor-account';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.plugin(UserPlugin, {
  // verifiedLogin: true, // Make sure the user is verified (by email)
  // expirePasswordDays: 90, // When the password expired
  // oldPasswords: 5, // Don't let the user change his password to used one (save 5 password)
  minPasswordStrength: 2, // zxcvbn minimum strength
});

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
