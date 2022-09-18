const Joi = require('joi')
const mongoose = require('mongoose')

const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema;
const Types = Schema.Types;

const Bank = new Schema({
    userPhoneNumber: Types.String,
    user: { type: Types.ObjectId, ref: "User", index: true },
    bankName: Types.String,
    accountName: Types.String,
    accountNumber: Types.String,
    sortCode: Types.String
})

function validateBank(Bank) {
    const schema = {
        phoneNumber: Joi.string().min(3).max(20).required(),
        bankName: Joi.string().min(3).max(100).required(),
        accountName: Joi.string().min(3).max(100).required(),
        accountNumber: Joi.string().min(3).max(20).required(),
        sortCode: Joi.string().min(6).max(6).required(),
    }
    return Joi.validate(Bank, schema);
}

var BankDetails = mongoose.model('Bank', Bank)
module.exports = { 
    Bank : BankDetails, 
    validateBank : validateBank
}

