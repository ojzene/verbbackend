const Joi = require('joi')
const mongoose = require('mongoose')

const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema;
const Types = Schema.Types;

const User = new Schema({
    firstName: Types.String,
    lastName: Types.String,
    email: Types.String,
    phone: Types.String,
    active: Types.Boolean,
    hash: Types.String,
    salt: Types.String
})

const UserActivation = new Schema({
    phone: Types.String,
    otpCode: Types.String,
    otpType: {
        type: String,
        enum: [ "verification", "forgotpassword" ],
        default: 'User'
    }
})

User.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex')
}

User.methods.validatePassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha512').toString('hex')
    return this.hash === hash;
}

User.methods.generateJWT = function() {
    const today = new Date()
    const expirationDate = new Date(today)
    expirationDate.setDate(today.getDate() + 60)
    
    return jwt.sign({
        phone: this.phone,
        id: this._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
}

User.methods.toAuthJSON = function() {
    return {
        _id: this._id,
        phone: this.phone,
        token: this.generateJWT(),
    };
}

User.pre('deleteOne', function(next) {
    // console.log(User)
    // UserBank.deleteOne({ User: User._id}).exec();
    next();
});

function validateUser(User) {
    const schema = {
        firstName: Joi.string().min(3).max(100).required(),
        lastName: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        phone: Joi.string().min(3).max(50).required()
    }
    return Joi.validate(User, schema);
}

function validateUserActivation(UserActivation) {
    const schema = {
        // email: Joi.string().min(5).max(255).required().email(),
        phone: Joi.string().min(3).max(20).required(),
        otpCode: Joi.string().min(6).max(6).required(),
        otpType: Joi.string().min(6).max(20).required()
    }
    return Joi.validate(UserActivation, schema);
}

function validateUserPhone(UserData) {
    const schema = {
        phone: Joi.string().min(10).max(20).required()
    }
    return Joi.validate(UserData, schema);
}

function validateResetPassword(UserData) {
    const schema = {
        phone: Joi.string().min(10).max(20).required(),
        newPassword: Joi.string().min(4).max(4).required()
    }
    return Joi.validate(UserData, schema);
}

var UserDetails = mongoose.model('User', User)
var UserActivationDetails = mongoose.model('UserActivation', UserActivation)
module.exports = { 
    User : UserDetails, 
    validateUser : validateUser,
    UserActivation: UserActivationDetails,
    validateUserActivation : validateUserActivation,
    validateUserPhone : validateUserPhone,
    validateResetPassword: validateResetPassword,
}

