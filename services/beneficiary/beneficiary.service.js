const { Beneficiary, validateBeneficiary } = require('../../models/beneficiary/beneficiary.model');
const { User } = require('../../models/user/user.model');
const { HandleResponse, RandomString, RandomNumber } = require('../../config/utils');

module.exports = {
    getAll(req, res) {
        Beneficiary.find(function (err, beneficiary) {
            HandleResponse(res, err, beneficiary, "Get All Beneficiaries");
        })
    },
    getById(req, res) {
        Beneficiary.findOne({_id : req.params.beneficiaryId}, (err, user) => {
            HandleResponse(res, err, user, "Get One Beneficiary");
        })
    },
    getByUserPhone(req, res) {
        Beneficiary.find({userPhoneNumber : req.params.phone}, (err, beneficiary) => {
            HandleResponse(res, err, beneficiary, "Get One Beneficiary By User Phone Number");
        })
    },
    getByEmail(req, res) {
        Beneficiary.findOne({email : req.params.email}, (err, user) => {
            HandleResponse(res, err, user, "Get One Beneficiary By Email Address");
        })
    },
    create(req, res) {
        console.log("req body:", req.body)
        const { error } = validateBeneficiary(req.body);
        if (error) {
            return HandleResponse(res, error.details[0].message, null, "Create Beneficiary");
        }
        const phoneNumber = req.body.phoneNumber;
        const accountNumber = req.body.accountNumber;
        User.findOne({ phone: phoneNumber }, (errUser, user) => {
            if(errUser) {
                return HandleResponse(res, err, null, "Error finding user");
            }
            if(user) {
                if (!user.validatePassword(password)) {
                    return HandleResponse(res, errUser, null, "Pin code incorrect");
                } else {
                    Beneficiary.findOne({userPhoneNumber: phoneNumber, accountNumber: accountNumber}, (err, beneficiary) => {
                        if(err){
                            return HandleResponse(res, err, null, "Error finding beneficiary");
                        }
                        if(beneficiary) {
                            return HandleResponse(res, beneficiary.accountName, null, `Beneficiary is already existing for this user`);
                        }
                        beneficiary = new Beneficiary();
                        beneficiary.userPhoneNumber = phoneNumber;
                        beneficiary.accountName = req.body.accountName;
                        beneficiary.sortCode = req.body.sortCode;
                        beneficiary.accountNumber = accountNumber;
                        beneficiary.beneficiaryName = req.body.beneficiaryName;
                        beneficiary.active = true;
            
                        beneficiary.save(function (err) {
                            if (err) {
                                return HandleResponse(res, err, null, "Error in creating Beneficiary");
                            }
                            Bank.findOne({userPhoneNumber: phoneNumber, accountNumber: accountNumber, sortCode: sortCode}, (err, bank) => {
                                if(err){
                                    return HandleResponse(res, err, null, "Error finding bank");
                                }
                                if(bank) {
                                    return HandleResponse(res, beneficiary.accountName, null, `Beneficiary already added to bank`);
                                }
                                bank = new Bank();
                                bank.userPhoneNumber = phoneNumber;
                                bank.user = user._id;
                                // bank.bankName = req.body.bankName;
                                bank.bankName = "Monzo";
                                bank.accountName = req.body.accountName;
                                bank.accountNumber = req.body.accountNumber;
                                bank.sortCode = req.body.sortCode;
                                bank.save(function (err) {
                                    if (err) {
                                        return HandleResponse(res, err, null, "Error Adding Bank");
                                    }
                                    // return HandleResponse(res, null, { info: bank }, "Bank successfully added");
                                    
                                    return HandleResponse(res, null, { info: beneficiary }, "Beneficiary added successfully");
                                })
                            })
                        })
                    })
                }
            }
        })
    },
    update(req, res) {
        const beneficiaryId = req.params.beneficiaryId;
        Beneficiary.findByIdAndUpdate(beneficiaryId, {$set:req.body}, (err, beneficiary) => {
            HandleResponse(res, err, beneficiary, "Update Beneficiary");
        })
    },
    delete(req, res) {
        Beneficiary.deleteOne({_id: req.params.beneficiaryId }, (err, beneficiary) => {
            if (err) {
                HandleResponse(res, err, null, "Delete Beneficiary");
            }
        })
    }
}