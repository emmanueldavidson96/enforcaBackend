import { Request, Response } from "express";
import bodyParser from "body-parser";
import jobRouter from '../src/routes/index'
const express = require("express");

const app = express();


app.use('/', jobRouter)

app.use(bodyParser.json())

const PORT = 8080;

app.use("/", (request:Request, response:Response) => {
    response.send("Welcome to Enforca Backend API")
})

app.listen(PORT, () => {
    console.log(`App is running at port ${PORT}`)
})