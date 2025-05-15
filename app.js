const express = require('express');
const mongoose = require('mongoose');
const adminRouter = require('./routes/admin');
const router = require('./routes/user');
const courseRouter = require('./routes/course');
const { User, Course, Admin, Purchase } = require('./models/db');

const app = express();

require('dotenv').config();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/admin", adminRouter);
app.use("/user", router);
app.use("/courses", courseRouter);

// DB connection
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI );
        console.log("Connected to database");
    } catch (err) {
        console.error("Error connecting to database:", err);
    }
}

connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
