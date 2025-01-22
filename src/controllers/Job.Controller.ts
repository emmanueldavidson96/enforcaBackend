import express, { request } from "express";
import { Job } from "../models/Job.Model";
import mongoose from "mongoose";
import userModel from "../models/user.model";
import { Application } from "../models/application.model";
import { AccountType, Role } from "../models/user.model";


enum JobStatus {
    Approved = "approved",
    Reject = 'reject',
    Pending = 'pending',
    In_Review = 'in_review'
}

export interface Job extends Document {
    Job_title: string,
    Job_description: string,
    Job_category: string,
    Job_type: string,
    Location: string,
    Requiremnet: string,
    status: JobStatus,
    Application_limit: number,
    Application_count: Number,
    Salary: String,
    Experience: Number
}


export const PostJob = async (request: express.Request, response: express.Response): Promise<void> => {
    try {
        const {
            Job_title,
            Job_description,
            Job_category,
            Job_type,
            Location, Requirement,
            Application_limit,
            Experience,
            Salary
        } = request.body;

        if (!Job_title || !Job_description || !Job_category
            || !Job_type || !Location || !Requirement || !Application_limit
            || !Experience || !Salary) {
            response.status(400).send('All field are require')
            return
        }

        const user = await userModel.findById(request.userId)
        if (user?.accountType !== AccountType.Company && user?.role !== Role.Admin) {
            response.status(401).send('Your account cannot post job')
            return
        }


        const jobPosts = new Job({
            Job_title,
            Job_description,
            Job_category,
            Job_type,
            Location, Requirement,
            Application_limit,
            Experience,
            Salary
        })


        user.job.push(jobPosts._id)
        await user.save()
        await jobPosts.save()



        response.status(400).json({
            success: true,
            message: 'Job posted successfully',
            jobPosts,
            user: {
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        response.status(500).send({ error: 'internal server error' })
    }
}

export const GetJobs = async (request: express.Request, res: express.Response): Promise<void> => {
    try {
        const { search } = request.query

        let queryObject = {}


        // searchBy jobType or jobTitle
        if (search) {
            const searchQuery = {
                $or: [
                    { jobTitle: { $regex: search, $options: "i" } },
                    { jobType: { $regex: search, $options: "i" } },
                ],
            }
            queryObject = { ...queryObject, ...searchQuery }
        }

        // find seaarch item query  in  the to database
        let queryResult = Job.find(queryObject).populate({
            path: "company",
            select: "-password",
        })
        //PAGINATION
        const page = Number(request.query.page) || 1;
        const limit = Number(request.query.limit) || 10;

        const skip = (page - 1) * limit;

        //records count
        const total = await Job.countDocuments(queryResult);
        const numPage = Math.ceil(total / limit)

        queryResult = queryResult.limit(limit * page)

        const jobs = await queryResult;

        res.status(200).json({
            success: true,
            counts: jobs.length,
            jobs,
            numPage
        })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const GetJobById = async (request: express.Request, res: express.Response): Promise<void> => {
    try {
        const { id } = request.params

        const JobById = await Job.findById({ _id: id }).populate({
            path: "company",
            select: "-password",
        }).populate({
            path: "application",
            populate: {
                path: "user",
                select: "email name phoneNumber _id",
            },
        })
        if (!JobById) {
            res.status(404).send('Job Not Found')
            return
        }

        res.status(200).send(JobById)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const GetApplicantForJob = async (request: express.Request, res: express.Response): Promise<void> => {
    try {
        const { jobId } = request.params

        const applicant = await Application.find({ job: jobId }).populate({
            path: 'user',
            select: "email name id phoneNumber"
        })

        res.status(200).json({
            success: true,
            counts: applicant.length,
            applicant
        })

    } catch (error) {
        res.status(500).send("internal server error")
    }
}

export const UpdateJobs = async (request: express.Request, res: express.Response): Promise<void> => {
    try {

        const {
            Job_title, Job_description,
            Job_category, Job_type,
            Location, Requirement, Experience, Salary
        } = request.body;
        const { jobId } = request.params;

        const JobById = await Job.findById({ _id: jobId })

        if (!JobById) {
            res.status(404).send('Job Not Found')
            return
        }

        const jobPost = {
            Job_title,
            Job_description,
            Job_category, Salary,
            Job_type, Experience,
            Location, Requirement,

        }

        const UpdatedJob = await Job.findByIdAndUpdate({ _id: jobId }, jobPost, { new: true })

        res.status(201).json({
            success: true,
            message: 'updated successfully',
            UpdatedJob
        })

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const DeleteJob = async (request: express.Request, res: express.Response): Promise<void> => {
    try {
        const { id } = request.params

        const JobById = await Job.findById({ _id: id })
        if (!JobById) {
            res.status(404).send('Job Not Found')
            return
        }
        const deletedJob = await Job.findByIdAndDelete({ _id: id })
        if (deletedJob) {
            // Remove the job from the user's job array
            const tay = await userModel.findByIdAndUpdate(
                request.userId,
                { $pull: { job: deletedJob._id } },
                { new: true }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Job Deleted Successfully',
            deletedJob
        })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}