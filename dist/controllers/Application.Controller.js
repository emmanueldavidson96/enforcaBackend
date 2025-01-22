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
exports.DeleteApplication = exports.AllApplication = exports.ApplicationById = exports.Apply = void 0;
const Job_Model_1 = require("../models/Job.Model");
const user_model_1 = __importDefault(require("../models/user.model"));
const user_model_2 = require("../models/user.model");
const application_model_1 = require("../models/application.model");
const Apply = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { CoverLetter, Resume, email } = request.body;
        const { jobId, userId } = request.params;
        // check if the accountType can apply for a job 
        const user = yield user_model_1.default.findById({ _id: userId });
        console.log(user);
        if (!user || user.accountType !== user_model_2.AccountType.Seeker) {
            response.status(401).send("Your account cannot apply for a job...Please create a seeker account type to have access to apply");
            return;
        }
        // check if all fields are input
        if (!CoverLetter || !Resume || !email) {
            response.status(401).send('All fields are required');
            return;
        }
        // check if their is existing application the particular job and prevent one email from applying twice
        const existingApplication = yield application_model_1.Application.findOne({ _id: userId }, { _id: jobId });
        if (existingApplication) {
            response.status(409).send('There is existing Application with this email');
            return;
        }
        // create a new application
        const application = new application_model_1.Application({
            CoverLetter,
            Resume,
            jobId,
            user,
            email,
        });
        response.status(201).json({
            success: true,
            message: 'Job application successfully',
            application
        });
        yield user_model_1.default.findOneAndUpdate({ _id: userId }, {
            $push: { application: application._id }
        }, { new: true }).populate("application job");
        yield Job_Model_1.Job.findByIdAndUpdate(jobId, {
            $push: { application: application._id }
        }, { new: true });
    }
    catch (error) {
        response.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.Apply = Apply;
const ApplicationById = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { applicationId } = request.params;
        const application = yield application_model_1.Application.findById({ _id: applicationId });
        if (!application) {
            response.status(404).send('Application not found');
        }
        response.status(200).json(application);
    }
    catch (error) {
        response.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.ApplicationById = ApplicationById;
const AllApplication = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId } = request.params;
        const applications = yield application_model_1.Application.find({ job: jobId }).populate('user');
        response.status(200).json({
            success: true,
            length: applications.length,
            applications
        });
    }
    catch (error) {
        console.log(error);
        response.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.AllApplication = AllApplication;
const DeleteApplication = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { applicationId } = request.params;
        const { jobId, userId } = request.params;
        const application = yield application_model_1.Application.findByIdAndDelete(applicationId);
        if (!application) {
            response.status(404).send("Application not found");
            return;
        }
        response.status(200).json({
            success: true,
            message: 'Application deleted successfully',
            application
        });
        yield user_model_1.default.findOneAndUpdate({ _id: userId }, {
            $pull: { application: application._id }
        }, { new: true }).populate("application job");
        yield Job_Model_1.Job.findByIdAndUpdate(jobId, {
            $pull: { application: application._id }
        }, { new: true });
    }
    catch (error) {
        response.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.DeleteApplication = DeleteApplication;
