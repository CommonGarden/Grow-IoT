import bcrypt from 'bcrypt';
import crypto from 'crypto';
import Promise from 'bluebird';
Promise.promisifyAll(bcrypt);

// bcrypt rounds
const saltRounds = 10;

class Password {
    /**
   * Encrypt plain text in sha256
   * @param plain
   * @returns {*}
   */
    static sha256(plain) {
        const digest = crypto.createHash('sha256').update(plain).digest('hex');
        return digest;
    }

    /**
   * Get password string, may recieve two options:
   * 1. String of the plain password
   * 2. Object of hashed password (sha256)
   * @param password
   * @returns {*}
   */
    static getPasswordString(password) {
        if (typeof password === 'string') {
            password = this.sha256(password);
        } else { // 'password' is an object
            if (password.algorithm !== 'sha-256') {
                throw new Error('Invalid password hash algorithm. ' +
          'Only \'sha-256\' is allowed.');
            }
            password = password.digest;
        }
        return password;
    }

    /**
   * Hash a password
   * @param password
   * @returns {*}
   */
    static hashPassword(password) {
        password = this.getPasswordString(password);
        return bcrypt.hashAsync(password, saltRounds);
    }

    /**
   * Compare encrypted password to plain password
   * The first password is the plain
   * The second password is the encrypted
   * @param password
   * @param hashedPassword
   * @returns {*}
   */
    static comparePassword(password, hashedPassword) {
        password = this.getPasswordString(password);
        return bcrypt.compareAsync(password, hashedPassword);
    }
}

export default Password;
