const { Bank, validateBank } = require('../../models/bank/bank.model');
const { User } = require('../../models/user/user.model');
const { HandleResponse, RandomString, RandomNumber } = require('../../config/utils');

module.exports = {
    getAll(req, res) {
        Bank.find(function (err, bank) {
            HandleResponse(res, err, bank, "Get All Bank");
        })
    },
    getById(req, res) {
        Bank.findOne({_id : req.params.transferId}, (err, user) => {
            HandleResponse(res, err, user, "Get One Bank");
        })
    },
    getByUserPhone(req, res) {
        Bank.find({userPhoneNumber : req.params.phone}, (err, bank) => {
            HandleResponse(res, err, bank, "Get One Bank By User Phone Number");
        })
    },
    getByEmail(req, res) {
        Bank.findOne({email : req.params.email}, (err, user) => {
            HandleResponse(res, err, user, "Get One Bank By Email Address");
        })
    },
    create(req, res) {
        console.log("req body:", req.body)
        const { error } = validateBank(req.body);
        if (error) {
            return HandleResponse(res, error.details[0].message, null, "Add Bank");
        }
        const phoneNumber = req.body.phoneNumber;
        User.findOne({ phone: phoneNumber }, (errUser, user) => {
            if(errUser) {
                return HandleResponse(res, err, null, "Error finding user");
            }
            if(user) {
                Bank.findOne({userPhoneNumber: phoneNumber}, (err, bank) => {
                    if(err){
                        return HandleResponse(res, err, null, "Error finding bank");
                    }
                    bank = new Bank();
                    bank.userPhoneNumber = phoneNumber;
                    bank.user = user._id;
                    bank.bankName = req.body.bankName;
                    bank.accountName = req.body.accountName;
                    bank.accountNumber = req.body.accountNumber;
                    bank.sortCode = req.body.sortCode;
                    bank.save(function (err) {
                        if (err) {
                            return HandleResponse(res, err, null, "Error Adding Bank");
                        }
                        return HandleResponse(res, null, { info: bank }, "Bank successfully added");
                    })
                })
            }
        })
    },
    update(req, res) {
        const userId = req.params.userId;
        Bank.findByIdAndUpdate(userId, {$set:req.body}, (err, bank) => {
            HandleResponse(res, err, bank, "Update Bank");
        })
    },
    delete(req, res) {
        Bank.deleteOne({_id: req.params.userId }, (err, bank) => {
            if (err) {
                HandleResponse(res, err, null, "Delete Bank");
            }
        })
    }
}