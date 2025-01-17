import express from 'express'

import jobs from './jobs'

const router = express.Router()

export default (): express.Router => {
    jobs(router)



    return(router)
}