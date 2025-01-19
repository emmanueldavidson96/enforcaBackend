import express from "express";
import * as Controller from "../controllers/user.controller";
import verifyToken from "../middlewares/verifyToken";
import upload from "../middlewares/multer";

const router = express.Router();

//Create a new Task Earner
router.post("/create-user", Controller.SignupHandler); // Done

//Login Task Earner/Task Creator
router.post("/login-user", Controller.LoginHandler); // Done

//Verify User and Retrieve User Details
router.get("/user-profile", verifyToken, Controller.getUserProfile); // Done

//Edit user information
router.post("/update-userinfo", verifyToken, upload.single("userImageUrl"), Controller.UpdateUserHandler)

//Get all users - For Admin
router.get("/users", Controller.GetAllUsers);

//Get Users by Id
router.get("/user/:id", verifyToken, Controller.GetUserById)

//Logout Users
router.post("/logout-user", Controller.LogoutUserHandler);



export default router