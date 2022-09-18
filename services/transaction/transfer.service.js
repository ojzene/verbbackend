const { Transfer, validateTransferPhone, validateTransferBank } = require('../../models/transaction/transfer.model');
const { Wallet } = require('../../models/transaction/wallet.model');
const { User } = require('../../models/user/user.model');
const { HandleResponse, RandomString, RandomNumber } = require('../../config/utils');
const { validateCard } = require('../../models/card/card.model');

module.exports = {
    getAll(req, res) {
        Transfer.find(function (err, transfer) {
            HandleResponse(res, err, transfer, "Get All Transfers");
        })
    },
    getById(req, res) {
        Transfer.findOne({_id : req.params.transferId}, (err, user) => {
            HandleResponse(res, err, user, "Get One Transfer");
        })
    },
    getByUserPhone(req, res) {
        Transfer.find({userPhoneNumber : req.params.phone}, (err, transfer) => {
            HandleResponse(res, err, transfer, "Get One Transfer By User Phone Number");
        })
    },
    getByEmail(req, res) {
        Transfer.findOne({email : req.params.email}, (err, user) => {
            HandleResponse(res, err, user, "Get One Transfer By Email Address");
        })
    },
    create(req, res) {
        console.log("req body:", req.body)
        const transferTypee = req.body.transferType;
        if(transferTypee == "user") {
            const { error } = validateTransferPhone(req.body);
            if (error) {
                return HandleResponse(res, error.details[0].message, null, "Create Transfer");
            }
        } else {
            const { error } = validateTransferBank(req.body);
            if (error) {
                return HandleResponse(res, error.details[0].message, null, "Create Transfer");
            }
        }
        
        const phoneNumber = req.body.phoneNumber;
        const accountNumber = req.body.accountNumber;
        const transferAmount =  parseFloat(req.body.amount);
        const transferType = req.body.transferType;
        User.findOne({ phone: phoneNumber }, (errUser, user) => {
            if(errUser) {
                return HandleResponse(res, err, null, "Error finding user");
            }
            if(user) {
                Wallet.findOne({userPhoneNumber: phoneNumber}, (err, wallet) => {
                    if(err){
                        return HandleResponse(res, err, null, "Error finding wallet");
                    }
                    if(wallet) {
                        const walletAmount = wallet.amount;
                        if(walletAmount > 0) {
                            if(transferAmount > walletAmount) {
                                return HandleResponse(res, "Insufficient fund", null, "Transfer Amount is greater than account balance");
                            } else {
                                var transfer = new Transfer();
                                transfer.userPhoneNumber = phoneNumber;
                                transfer.sender = user._id;
                                transfer.transferType = transferType;
                                transfer.amount = transferAmount;
                                transfer.remarks = req.body.remarks;
                                transfer.transactionDate = new Date();

                                if(transferType=="user") {
                                    let receiverPhone = req.body.receiverPhone;
                                    User.findOne({ phone: receiverPhone }, (errTUser, userT) => {
                                        if(errTUser) {
                                            return HandleResponse(res, err, null, "Recipient not found by Phone Number. Send to Bank Account");
                                        }
                                        if(userT) {
                                            transfer.receiverPhone = receiverPhone;
                                            Wallet.findOne({userPhoneNumber: receiverPhone}, (err, walletReceiver) => {
                                                if(err){
                                                    return HandleResponse(res, err, null, "Error finding wallet via Phone");
                                                }
                                                if(walletReceiver) {
                                                    const receiverWalletBalance = parseFloat(walletReceiver.amount);
                                                    walletReceiver.amount = receiverWalletBalance + transferAmount;
                                                    walletReceiver.save(function (errReceiverWallet) {
                                                        if (errReceiverWallet) {
                                                            return HandleResponse(res, errWallet, null, "Error trying to update wallet via Phone");
                                                        }
                                                        console.log("Receiver Wallet successfully updated via Phone");
                                                        // transfer.wallet = balanceRemain;
                                                       // return HandleResponse(res, null, { info: transfer }, "Receiver Wallet successfully updated via Phone");
                                                    })
                                                } else {
                                                    return HandleResponse(res, err, null, "Error finding receiver wallet via Phone");
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    transfer.accountNumber = accountNumber;
                                    transfer.accountName = req.body.accountName;
                                    transfer.beneficiary = req.body.beneficiary;
                                    Bank.findOne({accountNumber: accountNumber}, (err, bankReceiver) => {
                                        if(err){
                                            return HandleResponse(res, err, null, "Error finding wallet via Bank Account");
                                        }
                                        if(bankReceiver) {
                                            const receiverBankPhone = bankReceiver.userPhoneNumber;
                                            Wallet.findOne({userPhoneNumber: receiverBankPhone}, (err, bankReceiverWallet) => {
                                                if(err){
                                                    return HandleResponse(res, err, null, "Error finding wallet via Bank Account");
                                                }
                                                if(bankReceiverWallet) {
                                                    const receiverWalletBalance = parseFloat(walletReceiver.amount);
                                                    bankReceiverWallet.amount = receiverWalletBalance + transferAmount;
                                                    bankReceiverWallet.save(function (errReceiverWallet) {
                                                        if (errReceiverWallet) {
                                                            return HandleResponse(res, errWallet, null, "Error trying to update wallet via Bank Account");
                                                        }
                                                        console.log("Receiver Wallet successfully updated via Bank Account");
                                                       //  transfer.wallet = balanceRemain;
                                                        // return HandleResponse(res, null, { info: transfer }, "Receiver Wallet successfully updated via Bank Account");
                                                    })
                                                }  else {
                                                    return HandleResponse(res, err, null, "Error finding receiver wallet via Bank Account");
                                                }
                                            });
                                        } else {
                                            return HandleResponse(res, err, null, "Error finding receiver bank account");
                                        }
                                    });
                                }

                                transfer.save(function (err) {
                                    if (err) {
                                        return HandleResponse(res, err, null, "Error in making Transfer");
                                    }
                                    const balanceRemain = parseFloat(wallet.amount) - parseFloat(transferAmount);
                                    wallet.amount = balanceRemain;
                                    wallet.save(function (errWallet) {
                                        if (errWallet) {
                                            return HandleResponse(res, errWallet, null, "Error trying to update wallet");
                                        }
                                        transfer.wallet = balanceRemain;
                                        return HandleResponse(res, null, { info: transfer }, "Transfer successfully made");
                                    })
                                });

                            }
                        } else {
                            return HandleResponse(res, "Insufficient fund", null, `Insufficient money in your wallet`);
                        }
                        
                    } else {
                        return HandleResponse(res, "No funds in wallet", null, `Add money to your wallet first`);
                    }
                })
            }
        })
    },
    update(req, res) {
        const userId = req.params.userId;
        Transfer.findByIdAndUpdate(userId, {$set:req.body}, (err, transfer) => {
            HandleResponse(res, err, transfer, "Update Transfer");
        })
    },
    delete(req, res) {
        Transfer.deleteOne({_id: req.params.transferId }, (err, transfer) => {
            if (err) {
                HandleResponse(res, err, null, "Delete Transfer");
            }
        })
    }
}