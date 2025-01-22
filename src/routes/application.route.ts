
import express from 'express'
import { AllApplication, ApplicationById, Apply, DeleteApplication } from '../controllers/Application.Controller'
import verifyToken from '../middlewares/verifyToken'

const router = express.Router()

// application route
router.post('/apply/:jobId/:userId',verifyToken,Apply) // done

// get all application for a job
router.get('/getallapplication/:jobId', AllApplication) //done

// get application details
router.get('/get-application/:applicationId', verifyToken, ApplicationById) //done

// delete applications
router.delete('/delete-application/:applicationId',verifyToken, DeleteApplication) //done

export default router