import { Request, Response } from "express";

const express = require("express");

const app = express();

const PORT = 8080;

app.use("/", (request:Request, response:Response) => {
    response.send("Welcome to Enforca Backend API")
})

app.listen(PORT, () => {
    console.log(`App is running at port ${PORT}`)
})