const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // Server ko JSON data samajhne ke liye

// 1. MongoDB se Connect Karein
// 'myDatabase' aapke database ka naam hai, aap kuch bhi rakh sakte hain
mongoose.connect('mongodb://localhost:27017/myDatabase')
    .then(() => console.log("MongoDB se connection safal raha! 🎉"))
    .catch((err) => console.error("Connection fail ho gaya:", err));

// Server ko port 3000 par start karein
app.listen(3000, () => {
    console.log("Server port 3000 par chal raha hai...");
});
// 2. User ka Schema (Structure) banayein
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    age: Number,
    createdAt: { type: Date, default: Date.now }
});

// 3. Schema se Model banayein (Model hi database se baat karta hai)
const User = mongoose.model('User', userSchema);
// 4. POST Route: Naya User banane ke liye
app.post('/api/users', async (req, res) => {
    try {
        const newUserData = new User({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age
        });

        // Database mein save karein
        const savedUser = await newUserData.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 5. GET Route: Saare Users ko dekhne ke liye
app.get('/api/users', async (req, res) => {
    try {
        const allUsers = await User.find(); // .find() saara data nikal leta hai
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
