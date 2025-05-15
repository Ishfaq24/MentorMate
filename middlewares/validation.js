// middlewares/validation.js
const { z } = require('zod');

// Signup Validation
const validateSignup = (req, res, next) => {
    const schema = z.object({
        fullName: z.string().min(2).max(100),
        email: z.string().email().min(6).max(100),
        password: z.string().min(6).max(100)
    });

    const result = schema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ message: "Invalid signup data", errors: result.error.errors });
    }

    next();
};

// Login Validation
const validateLogin = (req, res, next) => {
    const schema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    });

    const result = schema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ message: "Invalid login data", errors: result.error.errors });
    }

    next();
};

// Course Validation
const validateCourse = (req, res, next) => {
    const schema = z.object({
        title: z.string().min(2).max(100),
        description: z.string().min(10).max(1000),
        price: z.number().positive(),
        imageUrl: z.string().url()
    });

    const result = schema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ message: "Invalid course data", errors: result.error.errors });
    }

    next();
};

module.exports = {
    validateSignup,
    validateLogin,
    validateCourse
};


