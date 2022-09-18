const Joi = require('joi')
const mongoose = require('mongoose')

const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema;
const Types = Schema.Types;

const Card = new Schema({
    userPhoneNumber: Types.String,
    user: { type: Types.ObjectId, ref: "User", index: true },
    cardname: Types.String,
    cardno: Types.String,
    expiryyear: Types.String,
    expirymonth: Types.String,
    cvv: Types.String
})

function validateCard(Card) {
    const schema = {
        phoneNumber: Joi.string().min(3).max(20).required(),
        cardname: Joi.string().min(3).max(100).required(),
        cardno: Joi.string().min(3).max(100).required(),
        expiryyear: Joi.string().min(2).max(2).required(),
        expirymonth: Joi.string().min(2).max(2).required(),
        cvv: Joi.string().min(3).max(3).required(),
    }
    return Joi.validate(Card, schema);
}

var CardDetails = mongoose.model('Card', Card)
module.exports = { 
    Card : CardDetails, 
    validateCard : validateCard
}

