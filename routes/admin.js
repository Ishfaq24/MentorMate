const adminRouter = require('express').Router();

adminRouter.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;

    const schema = z.object({
        fullName: z.string().min(2).max(100),
        email: z.string().min(6).max(100).email(),
        password: z.string().min(6).max(100)
    });

    const result = schema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    // check if user already exists
    const user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }

    // create a new user
    const newUser = new User({
        fullName,
        email,
        password
    });

    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
});

adminRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }   

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
    }

    return res.status(200).json({ message: "Login successful" });
}); 

adminRouter.post("course/add", async (req, res) => {
    const { title, description, price, imageUrl } = req.body;

    const schema = z.object({
        title: z.string().min(2).max(100),
        description: z.string().min(10).max(1000),
        price: z.number().positive(),
        imageUrl: z.string().url()
    });

    const result = schema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    // create a new course
    const newCourse = new Course({
        title,
        description,
        price,
        imageUrl
    });

    await newCourse.save();

    return res.status(201).json({ message: "Course created successfully" });
});


adminRouter.put("/course", async (req, res) => {});

adminRouter.get('/', (req, res) => {
    res.send('Admin Dashboard');
});


module.exports = adminRouter;