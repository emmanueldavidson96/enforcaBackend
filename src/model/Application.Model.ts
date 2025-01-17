import mongoose from "mongoose";
// import {User } from './userModel'
// import { Job } from "./Job.Model"


enum ApplicationStatus  {
    Pending ="pending",
    Accepted ='accepted',
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


export const createApplication = (value:Record<string, any>)=>new Application(value).save().then((apply)=>apply.toObject())
export const getexistingApplication = (userId:string,jobId:string)=>  Application.findOne({ jobId: jobId, userId:userId})
export const getAllApplication = (jobId:String) => Application.find({_id:jobId})
export const getApplicationById = (id:string)=> Application.findOne({_id:id}).populate("user")
export const getAllApplicationByEmail =(query:Object)=> Application.findOne({query})
export const updateApplicationById = (id:string, value:Record<string,any>) => Application.findByIdAndUpdate({_id:id}, value)
export const deleteApplicationById = (id:string)=>Application.findByIdAndDelete({_id:id})