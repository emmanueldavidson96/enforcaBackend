"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Controller = __importStar(require("../controllers/user.controller"));
const verifyToken_1 = __importDefault(require("../middlewares/verifyToken"));
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = express_1.default.Router();
//Create a new Task Earner
router.post("/create-user", Controller.SignupHandler); // Done
//Login Task Earner/Task Creator
router.post("/login-user", Controller.LoginHandler); // Done
//Verify User and Retrieve User Details
router.get("/user-profile", verifyToken_1.default, Controller.getUserProfile); // Done
//Edit user information
router.post("/update-userinfo", verifyToken_1.default, multer_1.default.single("userImageUrl"), Controller.UpdateUserHandler);
//Get all users - For Admin
router.get("/users", Controller.GetAllUsers);
//Get Users by Id
router.get("/user/:id", verifyToken_1.default, Controller.GetUserById);
//Logout Users
router.post("/logout-user", Controller.LogoutUserHandler);
exports.default = router;
