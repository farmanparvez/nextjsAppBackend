const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const authSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'User name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    confirmPassword: {
        type: String,
        required: [true, 'Confirm Password is required'],
        validate: {
            validator: function (v) {
                return v === this.password;
            },
            message: 'Passwords do not match'
        }
    },
    accessToken: {
        type: String,
    },
    refreshAccessToken: {
        type: String,
    }
})

authSchema.methods.comparePassord = function(enteredPassword, userPassowrd){
    return bcrypt.compare(enteredPassword, userPassowrd)
}

authSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    this.confirmPassword = undefined
    next()
})

module.exports = Auth = mongoose.model('Auth', authSchema);