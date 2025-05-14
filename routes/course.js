const express = require('express');
const courseRouter = express.Router();

courseRouter.post("/purchase", async (req, res) => {
    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    // Create a new purchase
    const purchase = new Purchase({
        userId: req.user.id,
        courseId: course._id
    });

    await purchase.save();

    return res.status(201).json({ message: "Course purchased successfully" });
});


courseRouter.post("/add", async (req, res) => {});



module.exports = courseRouter;