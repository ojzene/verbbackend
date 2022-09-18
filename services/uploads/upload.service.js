var multer  = require('multer');
var uploadMiddleware= require('../../config/upload.middleware');

const { User } = require('../../models/user/user.model');
const { UserProfile } = require('../../models/user/userprofile.model');

const { HandleResponse } = require('../../config/utils');

module.exports = {
    uploadForm: function(req,res){
        // res.render('upload-form');
        HandleResponse(res, null, "Retrieval Done", "Files retrieved successfully")
     },
    // uploadFiles: function(req,res){
    async uploadFiles (req, res) {

        const uploadCategory = req.params.category
        const userEmail = req.params.email

        console.log("req for user::::", uploadCategory);
        console.log("email::::", userEmail);

        const user = await getRecordById('User', 'email', userEmail);
        if(user) {
            let userId = user._id;

            const uploadNameId = userId+'-'+Date.now();

            var upload = multer({
                            storage: uploadMiddleware.files.storage(uploadCategory, uploadNameId), 
                            allowedFiles: uploadMiddleware.files.allowedFiles 
                        }).array('files');
    
            upload(req, res, function (err) {
               if (err instanceof multer.MulterError) {
                //   res.send(err);
                    HandleResponse(res, err, null, "Library Upload Err")
               } else if (err) {
                //   res.send(err);
                    HandleResponse(res, err, null, "File Upload Err")
               } else {
                //   res.render('upload-form');
                    UserProfile.find({ user: userId, profileId: uploadNameId }, (err, userProfile) => {
                        if (err) {
                            return HandleResponse(res, err, null, "Error finding User Profile")
                        }
                        console.log("user profile::::", userProfile)
                        if (userProfile.length >=1) {
                            return HandleResponse(res, userProfile, null, "User Profile already exist")
                        }
        
                        userProfile = new UserProfile()
                        userProfile.profileId = uploadNameId
                        userProfile.user = userId
                        userProfile.save(function (err) {
                            if (err) {
                                return HandleResponse(res, err, null, "Save User Profile to DB Error")
                            }
                            // return HandleResponse(res, null, userLang, "User Language Created Successfully")
                            return HandleResponse(res, null, { 
                                email: userEmail,
                                dateUploaded: getTodaysDate(),
                                fileName: uploadNameId,
                                fileUri: "http://localhost/sites/x/2021/ODOPARK/api/public/uploads/"+uploadCategory+"/"+uploadNameId+".jpg" }, 
                            "Upload successfully done")
                        })
                    })

                    // HandleResponse(res, null, "Upload Done", "Upload successfully done")
               }
            })

        } else {
            // User not found
            return HandleResponse(res, "Not found", null, "User not found")
        }

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


function getTodaysDate() {
    var today = new Date();
    var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    return dateTime
}

