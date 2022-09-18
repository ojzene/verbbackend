const { User } = require('../../models/user/user.model')
const { UserLanguage, validateUserLanguage } = require('../../models/user/userlanguage.model')
const { HandleResponse } = require('../../config/utils')

module.exports = {
    getAll (req, res) {
        UserLanguage.find(function (err, userLang) {
            HandleResponse(res, err, userLang, "Get All User Languages")
        })
    },
    getById (req, res) {
        UserLanguage.findOne({_id : req.params.langId}, (err, userLang) => {
            HandleResponse(res, err, userLang, "Get One User Language")
        })
    },
    async create (req, res) {
        const { error } = validateUserLanguage(req.body)
        if (error) {
            return HandleResponse(res, error.details[0].message, null, "User Language Validation Failed")
        }

        const email = req.body.email;
        const user = await getRecordById('User', 'email', email);
        if(user) {
            const userId = user._id;
            UserLanguage.findOne({ user: userId }, (err, userLang) => {
                if (err) {
                    return HandleResponse(res, err, null, "Error finding User Language")
                }
                if (userLang) {
                    return HandleResponse(res, userLang, null, "User Language already exist")
                }

                userLang = new UserLanguage()
                userLang.languages = req.body.languages
                userLang.user = userId

                userLang.save(function (err) {
                    if (err) {
                        return HandleResponse(res, err, null, "User Language Creation Error")
                    }
                    return HandleResponse(res, null, userLang, "User Language Created Successfully")
                })
            })
        } else {
            // User not found
            return HandleResponse(res, err, null, "User not found")
        }
    },
    update (req, res) {
        const userLangId = req.params.langId;
        UserLanguage.findByIdAndUpdate(userLangId, {$set:req.body}, (err, userLang) => {
            HandleResponse(res, err, userLang, "Update User Language")
        })
    },
    delete (req, res) {
        UserLanguage.deleteOne({_id: req.params.langId }, (err, work) => {
            if (err) {
                HandleResponse(res, err, null, "Delete  User Language")
            }
        })
    }
}


async function getRecordPromise(TableName, key, rId) {
    var objReq;
    if(key == 'phone') {
        objReq = { phone : rId };
    } else if(key == 'email') {
        objReq = { email : rId };
    } else {
        objReq = { _id : rId };
    }
    return new Promise(function(fullfil, reject) {
        if(TableName == "User") {
            User.findOne(objReq, function (err, user, stderr) {
                if (err) { reject(err) }
                else { fullfil(user) }
            })
        } else if(TableName == "WorkEducation")  {
            WorkEducation.findOne(objReq, function (err, userLang, stderr) {
                if (err) { reject(err) }
                else { fullfil(userLang) }
            })
        } else if(TableName == "FunQuestion")  {
            FunQuestion.findOne(objReq, function (err, funQuestion, stderr) {
                if (err) { reject(err) }
                else { fullfil(funQuestion) }
            })
        } else if(TableName == "UserLanguage")  {
            UserLanguage.findOne(objReq, function (err, userLang, stderr) {
                if (err) { reject(err) }
                else { fullfil(userLang) }
            })
        }
    })
}
function getRecordById(TableName, key, userId){
    return getRecordPromise(TableName, key, userId).then(function(result) {
        return result;
      });
}

