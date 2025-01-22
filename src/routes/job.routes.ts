import express from 'express'

import { PostJob,GetJobs, GetJobById, DeleteJob, UpdateJobs,GetApplicantForJob } from '../controllers/Job.Controller'
import verifyToken from '../middlewares/verifyToken'

const router = express.Router()



router.post('/post-job',verifyToken, PostJob)

router.get('/get-jobs',  GetJobs) //done

router.get('/get-job/:id', GetJobById) // done

router.get('/get-applicant/:id',verifyToken, GetApplicantForJob)

router.delete('/delete-job/:id',verifyToken,DeleteJob) // done
 
router.patch('/update-job/:jobId',verifyToken,UpdateJobs) // done


export default router
