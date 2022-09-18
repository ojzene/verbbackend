const Joi = require('joi')
const mongoose = require('mongoose')

const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema;
const Types = Schema.Types;

const Wallet = new Schema({
    userPhoneNumber: Types.String,
    user: { type: Types.ObjectId, ref: "User", index: true },
    amount: Types.String,
    payMethod: Types.Object,
    remarks: Types.String
})

function validateWallet(Wallet) {
    const schema = {
        phoneNumber: Joi.string().min(3).max(20).required(),
        amount: Joi.string().min(3).max(100).required(),
        payMethod: Joi.object().min(3).max(100).required(),
        payType: Joi.string().min(3).max(100).required(),
        pinCode: Joi.number().min(1).max(9999).required(),
        remarks: Joi.string(),
    }
    return Joi.validate(Wallet, schema);
}

var WalletDetails = mongoose.model('Wallet', Wallet)
module.exports = { 
    Wallet : WalletDetails, 
    validateWallet : validateWallet
}
