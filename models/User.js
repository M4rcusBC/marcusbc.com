const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        sparse: true,
        trim: true,
        lowercase: true
    },
    phoneNumber: {
        type: String,
        sparse: true,
        trim: true
    },
    password: {
        type: String
    },
    name: String,
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    verificationTokens: {
        email: {
            token: String,
            expires: Date
        },
        phone: {
            token: String,
            expires: Date
        }
    },
    // For OAuth integrations
    oauthProfiles: [{
        provider: String, // 'github', 'apple', 'azure'
        id: String,
        data: Object
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to check password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);