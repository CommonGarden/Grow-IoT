export default {
    username: {
        type: String,
        required: true,
    },
    services: {
        password: {
            bcrypt: { type: String, select: false },
            reset: {
                token: String,
                when: Date,
            },
            changeDate: Date,
            oldPasswords: { type: [{ type: String }], select: false, default: [] },
        },
        lockout: {
            isLocked: { type: Boolean, default: false },
            reason: String
        },
        email: {
            verificationTokens: {
                type: [{
                    token: String,
                    address: String,
                    when: Date,
                }]
            }
        },
    },
    'emails': {
        type: [{
            address: {
                type: String,
                required: true,
            },
            verified: {
                type: Boolean,
                required: true,
                default: false,
            }
        }]
    },
    profile: {
        type: {
            firstName: {
                type: String,
                required: false,
            },
            lastName: {
                type: String,
                required: false,
            },
        },
        required: true,
    },
    roles: {
        type: [String]
    },
};
