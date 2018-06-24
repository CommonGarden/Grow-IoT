export default {
    /**
   * When true, user must verify his email before login is enabled
   */
    verifiedLogin: false,
    /**
   * After this amount of days, the password will expire
   * `false` or `0` is never expired
   */
    expirePasswordDays: 0,
    /**
   * Check if the new password was used in the last X times
   * `false` or `0` won't check
   */
    oldPasswords: 0,
    /**
   * Minimum password strength (zxcvbn checker)
   * `false` or `0` won't check
   */
    minPasswordStrength: 0,
};
