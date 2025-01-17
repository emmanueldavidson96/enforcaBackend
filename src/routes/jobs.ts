import express from 'express'

import { PostJob,GetJobs, GetJobById, DeleteJob, UpdateJobs } from '../controllers/Job.Controller'
// import { isAuthenticated } from '../middleware/index'


export default (router: express.Router)=>{
    router.post('/post-job',PostJob)
    router.get('/get-jobs',  GetJobs)
    router.get('/get-job/:id', GetJobById)
    router.delete('/delete-job/:id',DeleteJob)
    router.patch('/update-job/:id',UpdateJobs)
}