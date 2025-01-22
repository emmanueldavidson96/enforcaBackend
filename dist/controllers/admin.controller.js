"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateApplicationStatus = exports.getAllJobApplications = exports.UpdateJobStatus = exports.DeleteJob = exports.GetJobById = exports.GetJobs = void 0;
const Job_Model_1 = require("../models/Job.Model");
const application_model_1 = require("../models/application.model");
const user_model_1 = __importDefault(require("../models/user.model"));
// Admin Interaction with Job
const GetJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getJobs = yield Job_Model_1.Job.find();
        res.status(200).json({
            success: true,
            getJobs
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.GetJobs = GetJobs;
const GetJobById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const JobById = yield Job_Model_1.Job.findById(id);
        if (!JobById) {
            res.status(404).send('Job Not Found');
            return;
        }
        res.status(200).send(JobById);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.GetJobById = GetJobById;
const DeleteJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedJob = yield Job_Model_1.Job.findByIdAndDelete({ _id: id });
        if (!deletedJob) {
            res.status(404).send('Job Not Found');
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Job Deleted Successfully',
            deletedJob
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.DeleteJob = DeleteJob;
const UpdateJobStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const { userId } = req.params;
        const user = yield user_model_1.default.findOne({ _id: userId });
        // if(!user || user.role !== Role.Admin){
        //     res.status(401).send('error updating job status')
        //     return
        // }
        const JobS = yield Job_Model_1.Job.findByIdAndUpdate(id, { status }, { new: true });
        if (!JobS) {
            res.status(404).send('Job not found');
        }
        res.status(200).json({
            success: true,
            message: 'updated successfully',
            JobS
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.UpdateJobStatus = UpdateJobStatus;
// Admin Interaction with Application
const getAllJobApplications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jobId = req.params.jobId;
        const Applications = yield application_model_1.Application.find({ job: jobId }).populate('user');
        if (!Applications) {
            res.status(404).send('Application not found');
            return;
        }
        res.status(200).send({
            success: true,
            Applications
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getAllJobApplications = getAllJobApplications;
const UpdateApplicationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { applicationId } = req.params;
        const { Status } = req.body;
        const UpdatedJobApplication = yield application_model_1.Application.findByIdAndUpdate(applicationId, { Status }, { new: true });
        if (!UpdatedJobApplication) {
            res.status(404).send('Application Not Found');
            return;
        }
        res.status(200).json({
            success: true,
            message: 'updated successfully',
            UpdatedJobApplication
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.UpdateApplicationStatus = UpdateApplicationStatus;
