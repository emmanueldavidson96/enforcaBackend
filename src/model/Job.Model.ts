import mongoose from "mongoose"

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
    Salary:Number
}

const JobSchema = new mongoose.Schema({
    Job_title : {type:String, require:true, unique:true},
    Job_description : { type: String, require:true, unique:true},
    Job_category: {type:String, require:true, unique:true},
    Location:{type:String, require:true, unique:true},
    Requirement: {type:String, require:true, unique:true},
    status: {type:String, default:JobStatus.Pending, enum:Object.values(JobStatus)},
    Application_limit:{type:Number, require:true}
},{timestamps:true})


export const  Job = mongoose.model('Job', JobSchema)


export const createJob = (value:Record<string, any>)=> new Job(value).save().then((job)=>job.toObject())
export const getAllJob = () => Job.find()
export const getJobById = (id:string)=> Job.findOne({_id:id})
export const getJobByEmail =(query:Object)=> Job.findOne({query})
export const updateJob = (value: Record<string, any>, id:string)=> Job.findByIdAndUpdate({_id:id}, value, {new:true})
export const deleteJob = (id:string)=> Job.findByIdAndDelete({_id:id}) 
export const adminJobUpdate = (id:string, status:string)=> Job.findByIdAndUpdate({_id:id},{status:status})
