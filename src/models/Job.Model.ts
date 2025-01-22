import mongoose from "mongoose"
import { Schema } from "mongoose"

enum JobStatus{
    Approved="approved",
    Reject = 'reject',
    Pending = 'pending',
    In_Review =  'in_review'
}

interface  Job extends Document{
    Job_title: string,
    Job_description:string,
    Job_category:string,
    Job_type:string,
    Location:string,
    Requiremnet:string,
    status:JobStatus,
    Application_limit:number,
    Salary:String,
    Application_count: number; // Current number of applications
    Applications: mongoose.Types.ObjectId[]; // Array of application references
}

const JobSchema = new mongoose.Schema({
    application:[{type: mongoose.Schema.Types.ObjectId, ref:"Application"}],
    user:{type: mongoose.Schema.Types.ObjectId, ref: "User" },
    company:{type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    Job_title : {type:String, require:true, unique:true},
    Job_description : { type: String, require:true, unique:true},
    Job_category: {type:String, require:true, unique:true},
    Location:{type:String, require:true, unique:true},
    Salary:{type:String, require:true},
    Requirement: {type:String, require:true, unique:true},
    status: {type:String, default:JobStatus.Pending, enum:Object.values(JobStatus)},
    Application_limit:{type:Number},
    Application_count:{type:Number, default:0},
    Experience:{type:String, require:true},

},{timestamps:true})


export const  Job = mongoose.model('Job', JobSchema)


