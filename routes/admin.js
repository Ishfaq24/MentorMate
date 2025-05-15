const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // ✅ Add this line
const { Admin, Course } = require('../models/db');
const { validateSignup, validateLogin, validateCourse } = require('../middlewares/validation');
const { requireAuth } = require('../middlewares/auth');
const adminRouter = express.Router();

// ✅ Admin Signup
adminRouter.post('/signup', validateSignup, async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
            fullName,
            email,
            password: hashedPassword
        });

        await newAdmin.save();

        // ✅ Generate JWT token
        const token = jwt.sign(
            { id: newAdmin._id, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(201).json({ message: "Admin created successfully", token });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});

// ✅ Admin Login
adminRouter.post('/login', validateLogin, async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // ✅ Generate JWT token
        const token = jwt.sign(
            { id: admin._id, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({ message: "Login successful", token });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});

// ✅ Create New Course (Protected)
adminRouter.post('/add', requireAuth, validateCourse, async (req, res) => {
    const { title, description, price, imageUrl } = req.body;

    try {
        const newCourse = new Course({
            title,
            description,
            price,
            imageUrl,
            creatorId: req.adminId // Set in auth middleware from token
        });

        await newCourse.save();
        return res.status(201).json({ message: "Course created successfully" });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
});

// 🔧 Placeholder for update route
adminRouter.put('/', requireAuth, (req, res) => {
    res.status(501).json({ message: "Update route not implemented yet" });
});

// 🧭 Dashboard Route
adminRouter.get('/', (req, res) => {
    res.send('Admin Dashboard');
});

module.exports = adminRouter;
