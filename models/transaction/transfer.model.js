const Joi = require('joi')
const mongoose = require('mongoose')

const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema;
const Types = Schema.Types;

const Transfer = new Schema({
    userPhoneNumber: Types.String,
    sender: { type: Types.ObjectId, ref: "User", index: true },
    transferType: Types.String,
    amount: Types.String,
    accountNumber: Types.String,
    accountName: Types.String,
    receiverPhone: Types.String,
    beneficiary: { type: Types.ObjectId, ref: "Beneficiary", index: true },
    remarks: Types.String
})

function validateTransferBank(Transfer) {
    const schema = {
        phoneNumber: Joi.string().min(3).max(20).required(),
        amount: Joi.string().min(3).max(100).required(),
        accountName: Joi.string().min(3).max(100).optional(),
        remarks: Joi.string().min(3).max(100).optional(),
        beneficiary: Joi.string().min(3).max(100).optional(),
        transferType: Joi.string().min(3).max(100).optional(),
        pinCode: Joi.number().min(1).max(9999).required(),
        accountNumber: Joi.number().min(1).max(99999999999).optional()
    }
    return Joi.validate(Transfer, schema);
}

function validateTransferPhone(Transfer) {
    const schema = {
        phoneNumber: Joi.string().min(3).max(20).required(),
        amount: Joi.string().min(1).max(100).required(),
        remarks: Joi.string().min(3).max(100).optional(),
        // beneficiary: Joi.string().min(3).max(100).optional(),
        transferType: Joi.string().min(3).max(100).optional(),
        pinCode: Joi.number().min(1).max(9999).required(),
        receiverPhone: Joi.string().min(3).max(100).optional(),
    }
    return Joi.validate(Transfer, schema);
}

var TransferDetails = mongoose.model('Transfer', Transfer)
module.exports = { 
    Transfer : TransferDetails, 
    validateTransferBank : validateTransferBank,
    validateTransferPhone: validateTransferPhone
}

