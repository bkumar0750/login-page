const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const userModel = require("./models/user");
const postModel = require("./models/post");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Ensure JWT is imported

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Use cookie-parser middleware

// Root route
app.get('/', (req, res) => {
    console.log("hey 1");
    res.render('index'); // Simplified render call
});

// Registration route
app.post("/register", async (req, res) => {
    console.log("hey 2");
    const { email, password, username, name, age } = req.body;

    try {
        // Check if the user already exists
        let user = await userModel.findOne({ email });
        if (user) return res.status(400).send("User already registered");

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = await userModel.create({
            username,
            email,
            age,
            name,
            password: hashedPassword,
        });

        // Generate JWT token
        const token = jwt.sign({ email: email, userid: user._id }, "bhuvi");

        // Set token as a cookie
        res.cookie("token", token, { httpOnly: true });

        // Send registration success response
        res.send("Registered successfully");
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
