"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// import {User } from './userModel'
// import { Job } from "./Job.Model"
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["Pending"] = "pending";
    ApplicationStatus["Accepted"] = "accepted";
    ApplicationStatus["Interview"] = "interviewed";
    ApplicationStatus["Rejected"] = "rejected";
})(ApplicationStatus || (ApplicationStatus = {}));
const ApplicationSchema = new mongoose_1.default.Schema({
    Status: { type: String, default: ApplicationStatus.Pending, enum: Object.values(ApplicationStatus) },
    CoverLetter: { type: String, require: true, unique: true },
    Resume: { type: String, require: true, unique: true },
    email: { type: String, rquire: true, unique: true },
    jobId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Job', required: true },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
exports.Application = mongoose_1.default.model('Application', ApplicationSchema);
