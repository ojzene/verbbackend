const { Wallet, validateWallet } = require('../../models/transaction/wallet.model');
const { User } = require('../../models/user/user.model');
const { HandleResponse, RandomString, RandomNumber } = require('../../config/utils');

module.exports = {
    getAll(req, res) {
        Wallet.find(function (err, wallet) {
            HandleResponse(res, err, wallet, "Get All Wallet Balance");
        })
    },
    getById(req, res) {
        Wallet.findOne({_id : req.params.walletId}, (err, wallet) => {
            HandleResponse(res, err, wallet, "Get Wallet Balance");
        })
    },
    getByUserPhone(req, res) {
        Wallet.findOne({userPhoneNumber : req.params.phone}, (err, wallet) => {
            HandleResponse(res, err, wallet, "Get Wallet Balance By User Phone Number");
        })
    },
    getByEmail(req, res) {
        Wallet.findOne({email : req.params.email}, (err, wallet) => {
            HandleResponse(res, err, wallet, "Get Wallet Balance By Email Address");
        })
    },
    create(req, res) {
        console.log("req body:", req.body)
        const { error } = validateWallet(req.body);
        if (error) {
            return HandleResponse(res, error.details[0].message, null, "Add Money to Wallet");
        }
        let phoneNumber = req.body.phoneNumber;
        let amountToAdd = req.body.amount;
        User.findOne({ phone: phoneNumber }, (errUser, user) => {
            if(errUser) {
                return HandleResponse(res, err, null, "Error finding user");
            }
            if(user) {
                Wallet.findOne({userPhoneNumber: phoneNumber}, (err, wallet) => {
                    if(err){
                        return HandleResponse(res, err, null, "Error finding wallet");
                    }
                    console.log("wallet:::", wallet)
                    if(wallet) {
                        // return HandleResponse(res, wallet.accountName, null, `Money is already existing for this user`);
                        // wallet = new Wallet();
                        const walletBalance = parseFloat(wallet.amount);
                        console.log("wallet balance::::", walletBalance)
                        wallet.userPhoneNumber = phoneNumber;
                        wallet.amount = walletBalance + parseFloat(amountToAdd);
                        wallet.user = user._id;
                        wallet.payMethod = req.body.payMethod;
                        wallet.remarks = req.body.remarks;
                        wallet.save(function (err) {
                            if (err) {
                                return HandleResponse(res, err, null, "Error Updating Money in Wallet");
                            }
                            return HandleResponse(res, null, { info: wallet }, "Money successfully updated in Wallet");
                        })
                    } else {
                        let walleta = new Wallet();
                        walleta.userPhoneNumber = phoneNumber;
                        walleta.amount = parseFloat(amountToAdd);
                        walleta.user = user._id;
                        walleta.payMethod = req.body.payMethod;
                        walleta.remarks = req.body.remarks;
                        
                        walleta.save(function (err) {
                            if (err) {
                                return HandleResponse(res, err, null, "Error Adding Money to Wallet");
                            }
                            return HandleResponse(res, null, { info: walleta }, "Money successfully added to Wallet");
                        })
                    }
                })
            }
        })
    },
    update(req, res) {
        const userId = req.params.userId;
        Wallet.findByIdAndUpdate(userId, {$set:req.body}, (err, wallet) => {
            HandleResponse(res, err, wallet, "Update Money");
        })
    },
    delete(req, res) {
        Wallet.deleteOne({_id: req.params.userId }, (err, wallet) => {
            if (err) {
                HandleResponse(res, err, null, "Delete Wallet");
            }
        })
    }
}