import express from 'express'
import { Job } from '../models/Job.Model'
import  userModel  from '../models/user.model'
import { AccountType,Role } from '../models/user.model'
import { Application } from '../models/application.model'




export const Apply = async(request:express.Request, response:express.Response):Promise<void>=>{
    try {
        const {CoverLetter,Resume,email}= request.body
        
        const { jobId,userId  } = request.params

        // find if job is available for application
        const job = await Job.findById(jobId)
        if (!job) {
            response.status(404).send({
                success: false,
                message: "Jobs Not Found"
            })
            return
        }

        // check the application limit 
        if (
            job.Application_limit &&
            job.Application_limit > 0 &&
            job.Application_count >= job.Application_limit
          ) {
            response.status(400).send("Application limit reached for this job");
            return;
          }

        // check if the accountType can apply for a job 
        const user = await userModel.findById(userId)
        if (!user || user.accountType !== AccountType.Seeker){
          response.status(401).send("Your account cannot apply for a job...Please create a seeker account type to have access to apply");
          return;
        }
        

        // check if all fields are input
        if(!CoverLetter || !Resume || !email){
            response.status(401).send('All fields are required')
            return
        }

        // check if their is existing application the particular job and prevent one email from applying twice
        const existingApplication = await Application.findOne({userId:userId,jobId:jobId})

        if(existingApplication){
            response.status(409).send('There is existing Application with this email')
            return
        }

        // create a new application
        const application = new Application({
            CoverLetter,
            Resume,
            jobId,
            user: {
               email:user.email,
               name:user.name,
                _id:user._id,
                phoneNumber:user.phoneNumber,
                password:undefined,
                confirmPassword:undefined
              },
            email,
        })

        // update the application count 
        job.Application_count += 1;
        // push the application id to application query
        job.application.push(application._id);

        await job.save();

        // push the application id to usermodel
        user.application.push(application._id)
        await user.save()

        await application.save()


        response.status(201).json({
            success:true,
            message:'Job application successfully',
            application
        })
    } catch (error) {
        response.status(500).json({ error: 'Internal Server Error'});
    }
}

// getting applicant details
export const ApplicationById = async(request:express.Request, response:express.Response):Promise<void>=>{
    try {
        const { applicationId } = request.params

        const application = await Application.findById({_id:applicationId})
       
        if(!application){
            response.status(404).send('Application not found')
            return
        } 
        response.status(200).json(application)
        
    } catch (error) {
        response.status(500).json({ error: 'Internal Server Error'});
    }
}

//getting all application for jobs
export const AllApplication = async(request:express.Request, response:express.Response):Promise<void>=>{
    try {
        const { jobId }= request.params

        const applications = await Application.find({jobId}).populate({
            path: 'user',
            select: 'email name phoneNumber _id'}) 
       
            response.status(200).json({
            success:true,
            length:applications.length,     
            applications
        })
    } catch (error) {
        response.status(500).json({ error: 'Internal Server Error'});
    }
}

// delete application
export const DeleteApplication = async(request:express.Request, response:express.Response):Promise<void>=>{
    try {
        const  { applicationId } = request.params

        const {jobId,userId} = request.params
      
        const application = await Application.findByIdAndDelete(applicationId)
        if(!application){
            response.status(404).send("Application not found")
            return
        }
    
        await userModel.findByIdAndUpdate(
            request.userId,
             {
            $pull: { application: application._id }
        }, { new: true }).populate("application job")


         await Job.findByIdAndUpdate(jobId, {
             $pull: { application: application._id }
        }, { new: true })


        response.status(200).json({
            success:true,
            message:'Application deleted successfully',
            application
        })
    } catch (error) {
        response.status(500).json({ error: 'Internal Server Error'});
    }
}