import mongoose from "mongoose";
// import {User } from './userModel'
// import { Job } from "./Job.Model"


enum ApplicationStatus  {
    Pending ="pending",
    Accepted ='accepted',
    Interview = "interviewed",
    Rejected= 'rejected'
}

interface Application  extends Document{
    Status: ApplicationStatus,
    CoverLetter:String,
    Resume:String,
    email:String,
    user: mongoose.Types.ObjectId;
}

const ApplicationSchema = new mongoose.Schema({
    Status: {type:String, default:ApplicationStatus.Pending, enum:Object.values(ApplicationStatus)},
    CoverLetter: {type:String, require:true, unique:true},
    Resume: {type:String, require:true, unique:true},
    email: {type:String, rquire:true, unique:true},
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true }, 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},{timestamps:true})


export const Application =  mongoose.model('Application', ApplicationSchema)