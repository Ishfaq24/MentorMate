const express = require('express');
const courseRouter = express.Router();
const { Course, Purchase } = require('../models/db');
const { z } = require('zod');

// 🔐 Custom middleware (you'll create it separately)
const authenticateUser = require('../middlewares/authenticateUser');
const authenticateAdmin = require('../middlewares/authenticateAdmin');

// 📌 Zod schema for validation
const courseSchema = z.object({
    title: z.string().min(2).max(100),
    description: z.string().min(10).max(1000),
    price: z.number().positive(),
    imageUrl: z.string().url()
});

// ✅ Purchase a course (Only for logged-in users)
courseRouter.post("/purchase", authenticateUser, async (req, res) => {
    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    // Prevent duplicate purchase
    const existingPurchase = await Purchase.findOne({ userId: req.user.id, courseId });
    if (existingPurchase) {
        return res.status(400).json({ message: "Course already purchased" });
    }

    // Create a new purchase
    const purchase = new Purchase({
        userId: req.user.id,
        courseId: course._id
    });

    await purchase.save();
    return res.status(201).json({ message: "Course purchased successfully" });
});


// ✅ Add a new course (Only for admins)
courseRouter.post("/add", authenticateAdmin, async (req, res) => {
    const result = courseSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ message: "Invalid course data", errors: result.error.errors });
    }

    const { title, description, price, imageUrl } = req.body;

    const newCourse = new Course({
        title,
        description,
        price,
        imageUrl,
        creatorId: req.admin.id  // assuming admin info is stored here
    });

    await newCourse.save();

    return res.status(201).json({ message: "Course created successfully", course: newCourse });
});

// ✅ Get all courses (public route)
courseRouter.get("/", async (req, res) => {
    const courses = await Course.find();
    return res.status(200).json(courses);
});

module.exports = courseRouter;
