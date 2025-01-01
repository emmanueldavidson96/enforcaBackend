"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const PORT = 8080;
app.use("/", (request, response) => {
    response.send("Welcome to Enforca Backend API");
});
app.listen(PORT, () => {
    console.log(`App is running at port ${PORT}`);
});
