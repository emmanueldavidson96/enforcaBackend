
import express from 'express'
import { Job } from "../models/Job.Model";
import { Application } from '../models/application.model';
import userModel, { AccountType, Role } from '../models/user.model';

// Admin Interaction with Job
export const GetJobs = async (request: express.Request, response: express.Response): Promise<void> => {
    try {
        const getJobs = await Job.find()


        response.status(200).json({
            success: true,
            getJobs
        })
    } catch (error) {
        response.status(500).json({ error: 'Internal Server Error' });
    }
}

export const GetJobById = async (request: express.Request, response: express.Response): Promise<void> => {
    try {
        const { id } = request.params

        const JobById = await Job.findById(id)

        if (!JobById) {
            response.status(404).send('Job Not Found')
            return
        }
        response.status(200).send(JobById)
    } catch (error) {
        response.status(500).json({ error: 'Internal Server Error' });
    }
}

export const DeleteJob = async (request: express.Request, response: express.Response): Promise<void> => {
    try {
        const { id } = request.params

        const deletedJob = await Job.findByIdAndDelete({ _id: id })

        if (deletedJob) {
            const tay = await userModel.findByIdAndUpdate(
                request.userId,
                { $pull: { job: deletedJob._id } },
                { new: true }
            );
        }

        response.status(200).json({
            success: true,
            message: 'Job Deleted Successfully',
            deletedJob
        })
    } catch (error) {
        response.status(500).json({ error: 'Internal Server Error' });
    }
}

export const UpdateJobStatus = async (request: express.Request, response: express.Response): Promise<void> => {
    try {
        const { id } = request.params

        const { status } = request.body

        const { userId } = request.params

        const user = await userModel.findOne({ _id: userId })

        if (!user || user.role !== Role.Admin) {
            response.status(401).send('error updating job status')
            return
        }

        const JobS = await Job.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!JobS) {
            response.status(404).send('Job not found')
        }
        response.status(200).json({
            success: true,
            message: 'updated successfully',
            JobS
        })

    } catch (error) {
        response.status(500).json({ error: 'Internal Server Error' });
    }
}


// Admin Interaction with Application

export const getAllJobApplications = async (request: express.Request, response: express.Response): Promise<void> => {
    try {
        const jobId = request.params.jobId

        const Applications = await Application.find({ job: jobId }).populate('user')

        if (!Applications) {
            response.status(404).send('Application not found')
            return
        }
        response.status(200).send({
            success: true,
            Applications
        });
    } catch (error) {
        response.status(500).json({ error: 'Internal Server Error' });
    }
}

export const UpdateApplicationStatus = async (request: express.Request, response: express.Response): Promise<void> => {
    try {
        const { applicationId } = request.params

        const { Status } = request.body

        const UpdatedJobApplication = await Application.findByIdAndUpdate(applicationId, { Status }, { new: true })
        if (!UpdatedJobApplication) {
            response.status(404).send('Application Not Found')
            return
        }
        response.status(200).json({
            success: true,
            message: 'updated successfully',
            UpdatedJobApplication
        })

    } catch (error) {
        response.status(500).json({ error: 'Internal Server Error' });
    }
}