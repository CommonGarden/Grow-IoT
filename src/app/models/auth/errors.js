import ExtendableError from 'es6-error';

class AccountError extends ExtendableError {
  constructor(type, code, message) {
    super(message);
    this.type = type;
    this.code = code;
    this.errno = code;
  }
}

/**
 * Creates a specific error class
 */
function buildError(type, code, message) {
  return class extends AccountError {
    constructor() {
      super(type, code, message);
    }
  }
}

export { AccountError };

export const LOGIN_FAILED = buildError('LOGIN_FAILED', 11, 'Login failed');
export const LOGIN_FAILED_UNVERIFIED = buildError('LOGIN_FAILED_UNVERIFIED', 12, 'The user is not verified');
export const LOGIN_FAILED_PASSWORD_EXPIRED = buildError('LOGIN_FAILED_PASSWORD_EXPIRED', 13, 'The password of the user is expired');
export const INVALID_RESET_TOKEN = buildError('INVALID_RESET_TOKEN', 21, 'Invalid reset token');
export const INVALID_VERIFICATION_TOKEN = buildError('INVALID_VERIFICATION_TOKEN', 22, 'Invalid verification token');
export const WEAK_PASSWORD = buildError('WEAK_PASSWORD', 31, 'The password is not strong enough');
export const ACCOUNT_LOCKED = buildError('ACCOUNT_LOCKED', 41, 'Account is locked');
