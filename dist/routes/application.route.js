"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Application_Controller_1 = require("../controllers/Application.Controller");
const router = express_1.default.Router();
router.post('/apply/:jobId/:userId', Application_Controller_1.Apply);
router.get('/getallapplication/:jobId', Application_Controller_1.AllApplication);
router.get('/get-application/:applicationId', Application_Controller_1.ApplicationById);
router.delete('/delete-application/:applicationId', Application_Controller_1.DeleteApplication);
exports.default = router;
