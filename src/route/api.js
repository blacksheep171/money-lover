
import express from "express";
import userApiController from '../controller/userApiController'
import multer from "multer";
import path from "path";
var appRoot = require('app-root-path');

let router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // console.log(">>> check appRoot: ", appRoot);
        cb(null, appRoot + '/src/public/images/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

let upload = multer({ storage: storage, fileFilter: imageFilter });

const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const initAPIRoute = (app) => {
    // Users
    router.get('/users', userApiController.getAllUsers);
    router.post('/create-user', userApiController.createNewUser);
    router.put('/update-user', userApiController.updateUser);
    router.get('/users/:id', userApiController.getUser);
    router.delete('/delete-user/:id', userApiController.deleteUser);
    router.post('/upload/:id', upload.single('image') , userApiController.handleUploadFile);

    // Categories
    // Transactions
    // Prefix for api/v1
    return app.use("/api/v1/", router)
}

export default initAPIRoute;