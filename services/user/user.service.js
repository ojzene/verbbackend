const { 
    User, validateUser, UserActivation, 
    validateUserActivation, validateUserPhone, 
    validateResetPassword
} = require('../../models/user/user.model');
const { HandleResponse, RandomString, RandomNumber } = require('../../config/utils');

module.exports = {
    getAll(req, res) {
        User.find(function (err, users) {
            HandleResponse(res, err, users, "Get All Users");
        })
    },
    getById(req, res) {
        User.findOne({_id : req.params.userId}, (err, user) => {
            HandleResponse(res, err, user, "Get One User");
        })
    },
    getByPhone(req, res) {
        User.findOne({phone : req.params.phone}, (err, user) => {
            HandleResponse(res, err, user, "Get One User By Phone Number");
        })
    },
    getByEmail(req, res) {
        User.findOne({email : req.params.email}, (err, user) => {
            HandleResponse(res, err, user, "Get One User By Email Address");
        })
    },
    create(req, res) {
       //  console.log("req body:", req.body)
        const { error } = validateUser(req.body);
        if (error) {
            return HandleResponse(res, error.details[0].message, null, "Create User");
        }
        const email = req.body.email
        const phone = req.body.phone
        var udata, info;
        if(email.length > 0) {
            udata = { email: email };
            info = "Email Address";
        }
        if(phone.length > 0) {
            udata = { phone: phone };
            info = "Phone Number";
        } else {
            return HandleResponse(res, err, null, "One of the fields is empty, either email or phone");
        }

        User.findOne(udata, (err, user) => {
            if(err){
                return HandleResponse(res, err, null, "Error finding user");
            }
            if (user) {
                return HandleResponse(res, user.firstName, null, `User ${info} already existed`);
            }
            user = new User();
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.phone = req.body.phone;
            user.email = req.body.email;
            // user.password = req.body.password;
            // user.password = RandomString(4);
            user.active = true;
 
            // user.setPassword(user.password);

            user.save(function (err) {
                if (err) {
                    return HandleResponse(res, err, null, "Error in creating User");
                }
                // generate User Verification OTP
                var userVerify = new UserActivation();
                userVerify.phone = req.body.phone;
                // userVerify.otpCode = RandomNumber(6); 
                userVerify.otpCode = "654321"; 
                userVerify.otpType = "verification";

                // send OTP To Phone
                userVerify.save(function (errVerify) {
                    if (errVerify) {
                        return HandleResponse(res, err, null, "User created but verification error occur");
                    }
                    return HandleResponse(res, null, { info: user, extra: user.toAuthJSON(), otpCode: userVerify.otpCode }, "User created successfully but not verified");
                })
            })
        })
    },
    verifyUser(req, res) {
        const { error } = validateUserActivation(req.body);
        if (error) {
            return HandleResponse(res, error.details[0].message, null, "User verification validation error");
        }
        const { phone, otpCode, otpType } = req.body;
        User.findOne({ phone: phone }, (err, user) => {
            if(err) { return HandleResponse(res, err, null, "Error finding user"); }
            if(user) {
                if(otpType !== "verification") {
                    return HandleResponse(res, err, null, "Unindentified otp type");
                } else {
                    UserActivation.findOne({ phone: phone, otpCode: otpCode, otpType: "verification" }, (errCode, userCodeData) => {
                        if(errCode) { return HandleResponse(res, errCode, null, "Error finding User OTP code") };
                        if(userCodeData) {
                            user.active = true;
                            user.save(function (err) {
                                if (err) {
                                    return HandleResponse(res, err, null, "Error verifying User");
                                }
                                return HandleResponse(res, null, { data: user, user: user.toAuthJSON() }, "User successfully verified");
                            })
                        } else {
                            return HandleResponse(res, err, null, "Invalid Verification Code");
                        }
                    })
                }
            } else {
                return HandleResponse(res, err, null, "User cannot be found");
            }
        })
    },
    getUserVerifyStatus(req, res) {
        const { phone } = req.params.phone;
        User.findOne({ phone: phone }, (err, user) => {
            if(err) { return HandleResponse(res, err, null, "Error finding user"); }
            if(user) {
                const pstatus = user.active;
                if(pstatus === true) {
                    return HandleResponse(res, null, { data: user, status: pstatus }, "User is verified");
                } else {
                    return HandleResponse(res, null, { data: user, status: pstatus }, "Not verified yet");
                }
            } else {
                return HandleResponse(res, err, null, "User cannot be found");
            }
        })
    },
    update(req, res) {
        const userId = req.params.userId;
        User.findByIdAndUpdate(userId, {$set:req.body}, (err, user) => {
            HandleResponse(res, err, user, "Update User");
        })
    },
    delete(req, res) {
        User.deleteOne({_id: req.params.userId }, (err, user) => {
            if (err) {
                HandleResponse(res, err, null, "Delete User");
            }
        })
    },
    forgotPassword(req, res) {
        const { error } = validateUserPhone(req.body);
        if (error) {
            return HandleResponse(res, error.details[0].message, null, "User Phone Number validation failed");
        }
        const { phone } = req.body;
        User.findOne({ phone: phone }, (err, user) => {
            if(err) { return HandleResponse(res, err, null, "Error finding user"); }
            if(user) {
                // generate User Verification OTP
                var userVerify = new UserActivation();
                userVerify.phone = phone;
                const setNewPassword = RandomString(6);
                userVerify.otpCode = setNewPassword; 
                userVerify.otpType = "forgotpassword";
                // send OTP To Phone
                userVerify.save(function (errVerify) {
                    if (errVerify) {
                        return HandleResponse(res, err, null, "Forgot password error occurred");
                    }
                    return HandleResponse(res, null, {otpCode: setNewPassword}, "Kindly enter otp for password reset");
                })

            } else {
                return HandleResponse(res, err, null, "User cannot be found");
            }
        })
    },
    verifyUserPasswordCode(req, res) {
        const { error } = validateUserActivation(req.body);
        if (error) {
            return HandleResponse(res, error.details[0].message, null, "User verification validation error");
        }
        const { phone, otpCode, otpType } = req.body;
        User.findOne({ phone: phone }, (err, user) => {
            if(err) { return HandleResponse(res, err, null, "Error finding user"); }
            if(user) {
                if(otpType !== "forgotpassword") {
                    return HandleResponse(res, err, null, "Unindentified otp type");
                } else {
                    UserActivation.findOne({ phone: phone, otpCode: otpCode, otpType: "forgotpassword" }, (errCode, userCodeData) => {
                        if(errCode) { return HandleResponse(res, errCode, null, "Error finding User OTP code") };
                        if(userCodeData) {
                            // user.active = true;
                            // user.save(function (err) {
                            //     if (err) {
                            //         return HandleResponse(res, err, null, "Error verifying User");
                            //     }
                            const newPassword = RandomString(6);
                            user.setPassword(newPassword);
                            user.save(function (err) {
                                if (err) {
                                    return HandleResponse(res, err, null, "Error verifying User Code");
                                }
                                return HandleResponse(res, null, { info: newPassword, extra: user.toAuthJSON() }, "OTP Code verified. New Password is: "+newPassword+", You can reset after login or in settings.");
                           })
                        } else {
                            return HandleResponse(res, err, null, "Error in verifying User OTP Code");
                        }
                    })
                }
            } else {
                return HandleResponse(res, err, null, "User cannot be found");
            }
        })
    },
    resetUserPassword(req, res) {
        const { error } = validateResetPassword(req.body);
        if (error) {
            return HandleResponse(res, error.details[0].message, null, "User verification validation error");
        }
        const { phone, newPassword } = req.body;
        User.findOne({ phone: phone }, (err, user) => {
            if(err) { return HandleResponse(res, err, null, "Error finding user"); }
            if(user) {
                user.setPassword(newPassword);
                user.save(function (err) {
                    if (err) {
                        return HandleResponse(res, err, null, "Error changing User Password");
                    }
                    return HandleResponse(res, null, { info: user, extra: user.toAuthJSON() }, "Password successfully reset");
                })
            } else {
                return HandleResponse(res, err, null, "User cannot be found");
            }
        })
    },
}