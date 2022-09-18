const mongoose = require("mongoose")
const passport = require("passport")

const User = mongoose.model('User')

module.exports = {
    login (req, res, next) {
        const phone = req.body.phone
        const password = req.body.password
        if (!phone) {
            return res.status(422).json({
                error: 'phone number is required'
            })
        }
        if (!password) {
            return res.status(422).json({
                error: 'password is required'
            })
        }
        return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
            if (err) {
                return next(err)
            } 
            if (passportUser) {
                const user = passportUser
                user.token = passportUser.generateJWT()
                return res.json({ 
                    success: true, 
                    message: 'login successful',
                    data: { info: user, extra: user.toAuthJSON() } 
                })
            }
            return res.status(400).json({
                status: false,
                message: info.errors
            })
        })(req, res, next)
    },
    currentUser (req, res, next) {
        const { payload: { id } } = req
        return User.findById(id).then((user) => {
            if (!user) {
                return res.sendStatus(400)
            }
            return res.json({ 
                success: true ,
                message: 'current user',
                data: user.toAuthJSON()
            })
        })
    }

}