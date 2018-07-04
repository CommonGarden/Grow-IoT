import moment from 'moment';
import * as Errors from './errors';

const SELECT_HIDDEN_FIELDS = '+services.password.bcrypt +services.password.oldPasswords';

export default function (config) {
  return {
    getFull(query) {
      return this.findOne(query).select(SELECT_HIDDEN_FIELDS).execAsync();
    },

    /**
     * Login
     * Return the user if success, false if not
     * throwError is for backward compatibility
     * @param username
     * @param password
     * @param throwError - if true, throw an error (Promise reject), else, return false if can't login
     * @returns {Promise.<T>}
     */
    login(username, password, throwError = false) {
      // Selecting password and emails (for getting the isVerified virtual)
      return this.findOne({username: username}).select(SELECT_HIDDEN_FIELDS).execAsync()
        .then((user) => {
          if (!!user) {
            return user.comparePassword(password)
              .then((res) => {
                // Check password
                if (!res) {
                  if (!!throwError) throw new Errors.LOGIN_FAILED();
                  return false;
                }

                // Check if locked
                if (!!user.locked) {
                  if (!!throwError) throw new Errors.ACCOUNT_LOCKED();
                  return false;
                }

                // Enforcing user verification only if configured
                if (config.verifiedLogin === true && !user.isVerified) {
                  if (!!throwError) throw new Errors.LOGIN_FAILED_UNVERIFIED();
                  return false;
                }
                
                // Check password expiration date
                if (!!config.expirePasswordDays && config.expirePasswordDays > 0) {
                  const expirationDate = moment().subtract(config.expirePasswordDays, 'd');
                  if (user.services.password.changeDate - expirationDate <= 0) {
                    if (!!throwError) throw new Errors.LOGIN_FAILED_PASSWORD_EXPIRED();
                    return false;
                  }
                }

                // Finally return the user
                return user;
              });
          }
          else {
            if (!!throwError) throw new Errors.LOGIN_FAILED();
            return false;
          }
        });
    },
  };
};
