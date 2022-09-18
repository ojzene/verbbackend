const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const Types = Schema.Types;

const UserProfile = new Schema({
    user: { type: Types.ObjectId, ref: "User", index: true },
    profileId: Types.String
})

var UserProfileInfo = mongoose.model('UserProfile', UserProfile)
module.exports = { UserProfile : UserProfileInfo }
