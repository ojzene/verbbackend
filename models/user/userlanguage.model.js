const Joi = require('joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Types = Schema.Types;

const UserLanguage = new Schema({
    user: { type: Types.ObjectId, ref: "User", index: true },
    languages: Types.Array
})

function validateUserLanguage(userLanguage) {
    const schema = {
        email: Joi.string().required(),
        languages: Joi.array().required()
    }
    return Joi.validate(userLanguage, schema);
}

var UserLanguageDetails = mongoose.model('UserLanguage', UserLanguage)
module.exports = { UserLanguage : UserLanguageDetails, validateUserLanguage: validateUserLanguage }
