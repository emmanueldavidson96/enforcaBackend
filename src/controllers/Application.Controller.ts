import express from 'express'
import { createApplication, deleteApplicationById, getAllApplication, getAllApplicationByEmail, getApplicationById, getexistingApplication } from '../model/Application.Model'
import { Job } from '../model/Job.Model'
import { User,getUser  } from '../model/userModel'
import { AccountType } from '../model/userModel'


export const Apply = async(req:express.Request, res:express.Response):Promise<void>=>{

    try {
        const {CoverLetter,Resume,email}= req.body
        
        const { jobId,userId  } = req.params
        
        // check if the accountType can apply for a job 
        const user =await getUser(userId);
        if (!user || user.accountType !== AccountType.seeker){
          res.status(401).send("Your account cannot apply for a job...Please create a seeker account type to have access to apply");
          return;
        }
        

        // check if all fields are input
        if(!CoverLetter || !Resume || !email){
            res.status(401).send('All fields are required')
            return
        }

        // check if their is existing application the particular job and prevent one email from applying twice
        const existingApplication = await getexistingApplication(userId, jobId)


        if(existingApplication){
            res.status(409).send('There is existing Application with this email')
            return
        }

        // create a new application
        const application = await  createApplication({
            CoverLetter,
            Resume,
            jobId,
            user,
            email,
        })


        res.status(201).json({
            success:true,
            message:'Job application successfully',
            application
        })

         await User.findOneAndUpdate({_id:userId}, {
            $push: { application: application._id }
        }, { new: true }).populate("application job")

         await Job.findByIdAndUpdate(jobId, {
            $push: { application: application._id }
        }, { new: true })

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error'});
    }
}


export const ApplicationById = async(req:express.Request, res:express.Response):Promise<void>=>{
    try {
        const { applicationId } = req.params

        const application = await getApplicationById(applicationId)
       
        if(!application){
            res.status(404).send('Application not found')
        } 
        res.status(200).json(application)
        
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error'});
    }
}

export const AllApplication = async(req:express.Request, res:express.Response):Promise<void>=>{
    try {
        const { jobId }= req.params


        const applications = await getAllApplication(jobId).populate('user') 

        res.status(200).json({
            success:true,
            length:applications.length,     
            applications
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error'});
    }
}


export const DeleteApplication = async(req:express.Request, res:express.Response):Promise<void>=>{
    try {
        const  { applicationId } = req.params

        const {jobId,userId} = req.params
      
        const application = await deleteApplicationById(applicationId)
        if(!application){
            res.status(404).send("Application not found")
            return
        }
        res.status(200).json({
            success:true,
            message:'Application deleted successfully',
            application
        })

        await User.findOneAndUpdate({_id:userId}, {
            $pull: { application: application._id }
        }, { new: true }).populate("application job")

         await Job.findByIdAndUpdate(jobId, {
             $pull: { application: application._id }
        }, { new: true })
        
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error'});
    }
}