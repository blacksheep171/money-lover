import express from "express";
import userApiController from "../controller/api/userApiController";
import categoryApiController from "../controller/api/categoryApiController";
import transactionApiController from "../controller/api/transactionApiController";
import authMiddleware from "../middleware/authMiddleware.js";

import { upload } from "../services/uploadService";

let router = express.Router();

const initAPIRoute = (app) => {
  // Users
  router.post("/register", userApiController.register);
  router.post("/login", userApiController.login);
  router.post("/refresh-token", userApiController.refreshToken);
  router.get("/users", userApiController.getAll);
  router.post("/create-user", userApiController.create);
  router.put("/update-user/:id", userApiController.update);
  router.get("/users/:id", userApiController.getUser);
  router.delete("/delete-user/:id", userApiController.deleteUser);
  router.post(
    "/upload/:id",
    upload.single("image"),
    userApiController.uploadImage
  );
  router.post(
    "/upload-base64/:id",
    upload.single("image"),
    userApiController.uploadBase64
  );

  // Categories
  router.get("/categories", categoryApiController.getAllCategories);
  router.get("/categories/:id", categoryApiController.getCategory);
  router.post("/create-category", categoryApiController.createNewCategory);
  router.put("/update-category/:id", categoryApiController.updateCategory);
  router.delete("/delete-categories/:id", categoryApiController.deleteCategory);
  // Transactions
  router.get("/transactions", transactionApiController.getAllTransactions);
  router.get("/transactions/:id", transactionApiController.getUserTransactions);
  router.post(
    "/create-transaction",
    transactionApiController.createNewTransaction
  );
  router.put(
    "/update-transaction/:id",
    transactionApiController.updateTransaction
  );
  router.delete(
    "/delete-transactions/:id",
    transactionApiController.deleteTransaction
  );
  router.get(
    "/total-transactions/:id",
    transactionApiController.getUserTotalTransaction
  );
  // Prefix for api/v1
  return app.use("/api/v1/", router);
};

export default initAPIRoute;
