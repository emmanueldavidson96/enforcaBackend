"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
var JobStatus;
(function (JobStatus) {
    JobStatus["Approved"] = "approved";
    JobStatus["Reject"] = "reject";
    JobStatus["Pending"] = "pending";
    JobStatus["In_Review"] = "in_review";
})(JobStatus || (JobStatus = {}));
const JobSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_2.Schema.Types.ObjectId, ref: "User" },
    company: { type: mongoose_2.Schema.Types.ObjectId, ref: "Company" },
    application: { type: mongoose_2.Schema.Types.ObjectId, ref: "Application" },
    Job_title: { type: String, require: true, unique: true },
    Job_description: { type: String, require: true, unique: true },
    Job_category: { type: String, require: true, unique: true },
    Location: { type: String, require: true, unique: true },
    Requirement: { type: String, require: true, unique: true },
    status: { type: String, default: JobStatus.Pending, enum: Object.values(JobStatus) },
    Application_limit: { type: Number, require: true },
    Experience: { type: String, require: true },
    Salary: { types: String }
}, { timestamps: true });
exports.Job = mongoose_1.default.model('Job', JobSchema);
