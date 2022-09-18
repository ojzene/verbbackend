const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local');
const { User } = require('../models/user/user.model');

passport.use(new LocalStrategy({
    usernameField: 'phone',
    passwordField: 'password',
}, (phone, password, done) => {
    User.findOne({ phone }).then((user) => {
        if (!user || !user.validatePassword(password)) {
            return done(null, false, { errors: 'Invalid Authentication Details'});
        }
        if(user.active === false) {
            return done(null, false, { errors: 'User is not yet verified'});
        } else {
            return done(null, user);
        }
    }).catch(done);
}));