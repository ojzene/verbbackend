const { Card, validateCard } = require('../../models/card/card.model');
const { User } = require('../../models/user/user.model');
const { HandleResponse, RandomString, RandomNumber } = require('../../config/utils');

module.exports = {
    getAll(req, res) {
        Card.find(function (err, card) {
            HandleResponse(res, err, card, "Get All Card");
        })
    },
    getById(req, res) {
        Card.findOne({_id : req.params.transferId}, (err, user) => {
            HandleResponse(res, err, user, "Get One Card");
        })
    },
    getByUserPhone(req, res) {
        Card.find({userPhoneNumber : req.params.phone}, (err, card) => {
            HandleResponse(res, err, card, "Get One Card By User Phone Number");
        })
    },
    getByEmail(req, res) {
        Card.findOne({email : req.params.email}, (err, user) => {
            HandleResponse(res, err, user, "Get One Card By Email Address");
        })
    },
    create(req, res) {
        console.log("req body:", req.body)
        const { error } = validateCard(req.body);
        if (error) {
            return HandleResponse(res, error.details[0].message, null, "Add Card");
        }
        const phoneNumber = req.body.phoneNumber;
        User.findOne({ phone: phoneNumber }, (errUser, user) => {
            if(errUser) {
                return HandleResponse(res, err, null, "Error finding user");
            }
            if(user) {
                Card.findOne({userPhoneNumber: phoneNumber}, (err, card) => {
                    if(err){
                        return HandleResponse(res, err, null, "Error finding card");
                    }
                        card = new Card();
                        card.userPhoneNumber = phoneNumber;
                        card.user = user._id;
                        card.cardname = req.body.cardname;
                        card.cardno = req.body.cardno;
                        card.expiryyear = req.body.expiryyear;
                        card.expirymonth = req.body.expirymonth;
                        card.cvv = req.body.cvv;
                        card.save(function (err) {
                            if (err) {
                                return HandleResponse(res, err, null, "Error Adding Card");
                            }
                            return HandleResponse(res, null, { info: card }, "Card successfully added");
                        })
                })
            }
        })
    },
    update(req, res) {
        const userId = req.params.userId;
        Card.findByIdAndUpdate(userId, {$set:req.body}, (err, card) => {
            HandleResponse(res, err, card, "Update Card");
        })
    },
    delete(req, res) {
        Card.deleteOne({_id: req.params.userId }, (err, card) => {
            if (err) {
                HandleResponse(res, err, null, "Delete Card");
            }
        })
    }
}