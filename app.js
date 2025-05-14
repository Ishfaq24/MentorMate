// creating a backend for a course selling application

const express = require('express');
const mongoose = require('mongoose');
const adminRouter = require('./routes/admin');
const router = require('./routes/user');
const courseRouter = require('./routes/course');   


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/admin", adminRouter);
app.use("/user", router);
app.use("/courses", courseRouter);

app.listen(3000, () => {
    console.log("server is running on http://localhost:3000");
    
})