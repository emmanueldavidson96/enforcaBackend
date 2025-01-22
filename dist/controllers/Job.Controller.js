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
exports.DeleteJob = exports.UpdateJobs = exports.GetJobById = exports.GetJobs = exports.PostJob = void 0;
// import { getUser,User } from "../models/userModel";
const Job_Model_1 = require("../models/Job.Model");
const user_model_1 = __importDefault(require("../models/user.model"));
const user_model_2 = require("../models/user.model");
var JobStatus;
(function (JobStatus) {
    JobStatus["Approved"] = "approved";
    JobStatus["Reject"] = "reject";
    JobStatus["Pending"] = "pending";
    JobStatus["In_Review"] = "in_review";
})(JobStatus || (JobStatus = {}));
const PostJob = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Job_title, Job_description, Job_category, Job_type, Location, Requirement, Application_limit, Experience, Salary } = request.body;
        if (!Job_title || !Job_description || !Job_category || !Job_type || !Location || !Requirement || !Application_limit || !Experience || !Salary) {
            response.status(400).send('All field are require');
            return;
        }
        //getting userId from authMiddleware and verifying it
        // const userId = request.userId;
        // console.log(userId)
        const user = yield user_model_1.default.findById(request.userId);
        console.log(user);
        if ((user === null || user === void 0 ? void 0 : user.accountType) !== user_model_2.AccountType.Company || (user === null || user === void 0 ? void 0 : user.role) !== user_model_2.Role.Admin) {
            response.status(401).send('Your account cannot post job');
            return;
        }
        if (Application_limit.length === Application_limit) {
            response.status(400).send('application full');
            return;
        }
        const jobPosts = new Job_Model_1.Job({
            Job_title,
            Job_description,
            Job_category,
            Job_type,
            Location, Requirement,
            Application_limit,
            Experience,
            Salary
        });
        yield jobPosts.save();
        response.status(400).json({
            success: true,
            message: 'Job posted successfully',
            jobPosts
        });
        yield user_model_1.default.findByIdAndUpdate(request.userId, {
            $push: { jobPost: jobPosts._id }
        }, { new: true });
    }
    catch (error) {
        console.log(error);
        response.status(500).send({ error: 'internal server error' });
        return;
    }
});
exports.PostJob = PostJob;
const GetJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search } = req.query;
        let queryObject = {};
        // searchBy jobType or jobTitle
        if (search) {
            const searchQuery = {
                $or: [
                    { jobTitle: { $regex: search, $options: "i" } },
                    { jobType: { $regex: search, $options: "i" } },
                ],
            };
            queryObject = Object.assign(Object.assign({}, queryObject), searchQuery);
        }
        // find seaarch item query  in  the to database
        let queryResult = Job_Model_1.Job.find(queryObject).populate({
            path: "company",
            select: "-password",
        });
        //PAGINATION
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        //records count
        const total = yield Job_Model_1.Job.countDocuments(queryResult);
        const numPage = Math.ceil(total / limit);
        queryResult = queryResult.limit(limit * page);
        const jobs = yield queryResult;
        res.status(200).json({
            success: true,
            counts: jobs.length,
            jobs,
            numPage
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
        const JobById = yield Job_Model_1.Job.findById({ _id: id }).populate({
            path: "company",
            select: "-password",
        }).populate({
            path: "application",
        });
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
const UpdateJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Job_title, Job_description, Job_category, Job_type, Location, Requirement, Experience, Salary } = req.body;
        console.log(req.body);
        const { jobId } = req.params;
        console.log(jobId);
        const JobById = yield Job_Model_1.Job.findById({ _id: jobId });
        if (!JobById) {
            res.status(404).send('Job Not Found');
            return;
        }
        const jobPost = {
            Job_title,
            Job_description,
            Job_category, Salary,
            Job_type, Experience,
            Location, Requirement,
        };
        console.log(jobPost);
        const UpdatedJob = yield Job_Model_1.Job.findByIdAndUpdate({ _id: jobId }, jobPost, { new: true });
        res.status(201).json({
            success: true,
            message: 'updated successfully',
            UpdatedJob
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
});
exports.UpdateJobs = UpdateJobs;
const DeleteJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const JobById = yield Job_Model_1.Job.findById({ _id: id });
        if (!JobById) {
            res.status(404).send('Job Not Found');
            return;
        }
        const deletedJob = yield Job_Model_1.Job.findByIdAndDelete({ _id: id });
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
