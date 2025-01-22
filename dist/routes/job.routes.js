"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Job_Controller_1 = require("../controllers/Job.Controller");
const router = express_1.default.Router();
router.post('/post-job', Job_Controller_1.PostJob);
router.get('/get-jobs', Job_Controller_1.GetJobs); //done
router.get('/get-job/:id', Job_Controller_1.GetJobById);
router.delete('/delete-job/:id', Job_Controller_1.DeleteJob);
router.patch('/update-job/:jobId', Job_Controller_1.UpdateJobs);
exports.default = router;
