const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const adminSchema = new schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

const courseSchema = new schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
});

const purchaseSchema = new schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = { User, Course, Admin, Purchase };
