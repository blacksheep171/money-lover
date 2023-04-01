
import express from "express";
import userApiController from '../controller/api/userApiController';
import categoryApiController from '../controller/api/categoryApiController';
import transactionApiController from '../controller/api/transactionApiController';
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
import path from "path";
var appRoot = require('app-root-path');

let router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
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
    router.post('/register', userApiController.register);
    router.post('/login', userApiController.login);
    router.get('/users', userApiController.getAll)
    router.post('/create-user', userApiController.create);
    router.put('/update-user/:id', userApiController.update);
    router.get('/users/:id', userApiController.getUser);
    router.delete('/delete-user/:id', userApiController.deleteUser);
    router.post('/upload/:id', upload.single('image') , userApiController.uploadImage);

    // Categories
    router.get('/categories', categoryApiController.getAllCategories);
    router.get('/categories/:id', categoryApiController.getCategory);
    router.post('/create-category', categoryApiController.createNewCategory);
    router.put('/update-category/:id', categoryApiController.updateCategory);
    router.delete('/delete-categories/:id', categoryApiController.deleteCategory);
    // Transactions
    router.get('/transactions', transactionApiController.getAllTransactions);
    router.get('/transactions/:id', transactionApiController.getUserTransactions);
    router.post('/create-transaction', transactionApiController.createNewTransaction);
    router.put('/update-transaction/:id', transactionApiController.updateTransaction);
    router.delete('/delete-transactions/:id', transactionApiController.deleteTransaction);
    router.get('/total-transactions/:id', transactionApiController.getUserTotalTransaction);
    // Prefix for api/v1
    return app.use("/api/v1/", router)
}

export default initAPIRoute;