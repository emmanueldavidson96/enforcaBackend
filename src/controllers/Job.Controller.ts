import express from "express";
import { createJob,deleteJob,getAllJob,getJobByEmail, getJobById, updateJob } from "../model/Job.Model";
import { getUser,User } from "../model/userModel";
import mongoose from "mongoose";

export const PostJob = async(req:express.Request, res:express.Response):Promise<void>=>{
    try {
        const {
            Job_title,
            Job_description,
            Job_category,
            Job_type,
            Location,Requirement,
            Application_limit
        } = req.body;

        if(!Job_title  || ! Job_description || !Job_category || !Job_type || !Location || !Requirement || !Application_limit){
            res.status(400).send('All field are require')
            return
        }

        //getting userId from authMiddleware and verifying it
        const id = req.body.user.userId;
        if (!mongoose.Types.ObjectId.isValid(id)) {
         res.status(404).send(`No account for this id:${id}`)
         return
        }

        const NewJob = await createJob({
            Job_title,
            Job_description,
            Job_category,
            Job_type,
            Location,Requirement,
            Application_limit
        })
        res.status(400).json({
            success:true,
            message:'Job posted successfully',
            NewJob
        })

        await User.findByIdAndUpdate(id,{
            $push:{jobPost:NewJob._id}},
        {new:true}
    )

    } catch (error) {
        res.status(500).send({error:'internal server error'})
    }
}

export const GetJobs= async(req:express.Request, res:express.Response):Promise<void>=>{
    try {
        const getJobs = await getAllJob()

        res.status(200).json({
            success:true,
            counts:getJobs.length,
            getJobs
        })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error'});
    }
}

export const GetJobById = async(req:express.Request, res:express.Response):Promise<void>=>{
    try {
        const { id } = req.params

        const JobById = await getJobById(id)

        if(!JobById){
            res.status(404).send('Job Not Found')
            return
        }
        res.status(200).send(JobById)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error'});
    }
}

export const UpdateJobs = async(req:express.Request, res:express.Response):Promise<void>=>{
    try {
        
        const {
            Job_title,Job_description,
            Job_category,Job_type,
            Location,Requirement
        } = req.body;

        const { id } = req.params


        const JobById = await getJobById(id)


        if(!JobById){
            res.status(404).send('Job Not Found')
            return
        }

        const jobPost = {
            Job_title,
            Job_description,
            Job_category,
            Job_type,
            Location,Requirement,
        } 

        const UpdatedJob = await updateJob(jobPost,id)


        res.status(201).json({
            success:true,
            message:'updated successfully',
            UpdatedJob 
        })

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error'});
       
    }
}

export const DeleteJob = async(req:express.Request, res:express.Response):Promise<void>=>{
    try {
        const { id } = req.params
        
        const JobById = await getJobById(id)

        if(!JobById){
            res.status(404).send('Job Not Found')
            return
        }

        const deletedJob = await deleteJob(id)

        res.status(200).json({
            success:true,
            message:'Job Deleted Successfully',
            deletedJob
        })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error'});
    }
}