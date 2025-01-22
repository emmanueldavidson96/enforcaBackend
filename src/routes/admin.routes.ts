
import express from 'express'
import { UpdateJobStatus,UpdateApplicationStatus } from '../controllers/admin.controller'
import verifyToken from '../middlewares/verifyToken'


const router = express.Router()

// update job status
router.patch('/update-job-status/:id',verifyToken, UpdateJobStatus) //done
// update apllication status
router.patch('/update-application/:applicationId/:userId',verifyToken, UpdateApplicationStatus) // done

export default router