const { User } = require('../../models/user/user.model');
const { HandleResponse, RandomString, RandomNumber } = require('../../config/utils');

module.exports = {
    verify(req, res, next) {
        console.log("req body:", req.body)
        const phoneNumber = req.body.phoneNumber;
        const password = String(req.body.pinCode);
        User.findOne({ phone: phoneNumber }, (errUser, user) => {
            if(errUser) {
                return HandleResponse(res, err, null, "Error finding user");
            }
            console.log("errUser::::", errUser)
            console.log("USER::::", user)
            console.log("USER VALIDATE::::", user.validatePassword(password));
            if(!user) {
                return HandleResponse(res, errUser, null, "User couldn't be found");
            } else if (!user.validatePassword(password)) {
                return HandleResponse(res, errUser, null, "Pin code incorrect");
            } else if(user.active === false) {
                // return done(null, false, { error: 'User is not yet verified'});
                return HandleResponse(res, errUser, null, "User is not yet verified");
            } else {
                // return done(null, user);
                next();
            }
        })
    },
    update(req, res) {
        const beneficiaryId = req.params.userId;
        Beneficiary.findByIdAndUpdate(beneficiaryId, {$set:req.body}, (err, pincode) => {
            HandleResponse(res, err, beneficiary, "Update Pin Code");
        })
    },
    delete(req, res) {
        Beneficiary.deleteOne({_id: req.params.userId }, (err, pincode) => {
            if (err) {
                HandleResponse(res, err, null, "Delete Pin Code");
            }
        })
    }
}