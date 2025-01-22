"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
const router = express_1.default.Router();
router.patch('/update-job-status/:id', admin_controller_1.UpdateJobStatus); //done
router.patch('/update-application/:applicationId/:userId', admin_controller_1.UpdateApplicationStatus);
exports.default = router;
