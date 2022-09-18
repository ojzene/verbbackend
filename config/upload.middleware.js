var multer = require('multer');

module.exports.files = {
    storage: function(uploadCategory, uploadNameId){

        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                if(uploadCategory == "profiles") {
                    cb(null, 'public/uploads/profiles/')
                } else if(uploadCategory == "services") {
                    cb(null, 'public/uploads/services/')
                } else {
                    cb(null, 'public/uploads/files/')
                }
            },
            filename: function (req, file, cb) {
                cb(null, uploadNameId+'.jpg');
            }
        })
        return storage;
    },
    allowedFiles:function(req, file, cb) {
        // Accept images only
        if (!file.originalname.match(/\.(pdf|doc|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
            req.fileValidationError = 'Only pdf|doc|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF file type are allowed!';
            return cb(new Error('Only pdf|doc|txt|jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF file type  are allowed!'), false);
        }
        cb(null, true);
    }
}
