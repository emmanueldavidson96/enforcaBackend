
import express from 'express'
import { Job,deleteJob,getAllJob, getJobById, updateJob } from "../model/Job.Model";
import {  Application, getAllApplication, getApplicationById } from '../model/Application.Model';


// Admin Interaction with Job

export const GetJobs= async(req:express.Request, res:express.Response):Promise<void>=>{
    try {
        const getJobs = await getAllJob()

        res.status(200).json({
            success:true,
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

export const UpdateJobStatus = async(req:express.Request, res:express.Response):Promise<void>=>{
    try {
        const { id } = req.params
        
        const   { status }  = req.body

        const JobById = await getJobById(id)

        if(!JobById){
            res.status(404).send('Job Not Found')
            return
        }

        const JobS = await Job.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        res.status(200).json({
            success:true,
            message:'updated successfully',
            JobS
        })

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error'});
    }
}


// Admin Interaction with Application

export const getAllJobApplications = async(req:express.Request, res:express.Response):Promise<void>=>{
    try {
        const jobId = req.params.jobId

        const Applications = await getAllApplication(jobId).populate('user')
        if(!Applications){
            res.status(404).send('Application not found')
            return
        }
        res.status(200).send({
            success: true,
            Applications
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error'});   
    }
}

export const UpdateApplicationStatus = async(req:express.Request, res:express.Response):Promise<void>=>{
    try {
        const { applicationId} = req.params

        const   { Status }  = req.body

        const ApplicationById = await getApplicationById(applicationId)
        
        if(!ApplicationById){
            res.status(404).send('Application Not Found')
            return
        }

        const UpdatedJobApplication = await Application.findByIdAndUpdate(applicationId, {Status},{new:true})
        res.status(200).json({
            success:true,
            message:'updated successfully',
            UpdatedJobApplication
        })

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error'});
    }
}