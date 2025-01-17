import express from 'express'
import { AllApplication, ApplicationById, Apply, DeleteApplication } from '../controllers/Application.Controller'


export default (router:express.Router)=>{
    router.post('/apply/:jobId/:userId',Apply)
    router.get('/getallapplication/:jobId', AllApplication)
    router.get('/get-application/:applicationId', ApplicationById)
    router.delete('/delete-application/:applicationId', DeleteApplication)
}