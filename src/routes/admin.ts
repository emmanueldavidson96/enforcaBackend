
import express from 'express'
import { UpdateJobStatus,UpdateApplicationStatus } from '../controllers/Admin.Controller'



export default (router:express.Router)=>{
    router.patch('/update-job-status/:id', UpdateJobStatus)
    router.patch('/update-application/:applicationId/:userId', UpdateApplicationStatus)
}