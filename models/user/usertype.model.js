const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const Types = Schema.Types;

const UserType = new Schema({
    userType: {
        type: String,
        enum: [ 'User', 'Admin', 'SuperAdmin' ],
        default: 'User'
    }
})

var UserTypeDetails = mongoose.model('UserType', UserType)
module.exports = { UserType : UserTypeDetails }
