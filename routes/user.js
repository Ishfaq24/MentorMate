const express = require('express');
const { model } = require('mongoose');
const router = express.Router();
const z = require('zod');


router.post('/signup',async (req,res)=>{
    const {fullName, email, password}= req.body;

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
})


router.post('/login',async (req,res)=>{
    const {email, password}= req.body;

   const user = await User.findOne({ email });
   if (!user) {
       return res.status(400).json({ message: "User not found" });
   }

   const isMatch = await user.comparePassword(password);
   if (!isMatch) {
       return res.status(400).json({ message: "Invalid password" });
   }

   return res.status(200).json({ message: "Login successful" });
});



module.exports = router;