const Joi = require('joi')
const mongoose = require('mongoose')

const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const Schema = mongoose.Schema;
const Types = Schema.Types;

const Beneficiary = new Schema({
    userPhoneNumber: Types.String,
    accountName: Types.String,
    accountNumber: Types.String,
    sortCode: Types.String,
    beneficiaryName: Types.String,
    active: Types.Boolean
})

function validateBeneficiary(Beneficiary) {
    const schema = {
        phoneNumber: Joi.string().min(3).max(20).required(),
        accountName: Joi.string().min(3).max(100).required(),
        accountNumber: Joi.number().min(1).max(99999999999).required(),
        sortCode: Joi.number().min(1).max(999999).required(),
        beneficiaryName: Joi.string().min(3).max(255).required(),
        pinCode: Joi.number().min(1).max(9999).required()
    }
    return Joi.validate(Beneficiary, schema);
}

var BeneficiaryDetails = mongoose.model('Beneficiary', Beneficiary)
module.exports = { 
    Beneficiary : BeneficiaryDetails, 
    validateBeneficiary : validateBeneficiary
}

