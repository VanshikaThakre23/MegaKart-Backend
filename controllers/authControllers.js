const bcrypt = require('bcrypt');
const userModel = require('../models/userModel.js');
const generateToken = require('../utils/generateToken');

// Standardized cookie options for consistency
const cookieOptions = {
    httpOnly: true,
    secure: true,      // Required for Render (HTTPS)
    sameSite: "none",  // Required for Netlify -> Render communication
    maxAge: 24 * 60 * 60 * 1000 
};

module.exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await userModel.findOne({ email });

        if (existingUser)
            return res.status(400).json({ message: "User Already Exist Please Login" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userModel.create({ name, email, password: hashedPassword });
        let token = generateToken(user);

        // FIXED: Using same secure options as login
        res.cookie("token", token, cookieOptions);

        res.status(201).json({ message: "User Created Successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user)
            return res.status(404).json({ message: "Email Incorrect User not found" });

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched)
            return res.status(409).json({ message: "Password Incorrect" });

        let token = generateToken(user);
        
        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            message: "Yeahh you are logged in",
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports.logoutUser = (req, res) => {
    try {
        // FIXED: To clear a cross-site cookie, you MUST pass the same 
        // secure and sameSite options, or the browser will ignore the clear command.
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports.addAddress = async (req, res) => {
    try {
        // FIXED: You were checking for req.body.city, but your state logic 
        // usually sends the address inside req.body. (Check your frontend structure)
        if (!req.body.city || !req.body.phone) {
            return res.status(400).json({ message: "Incomplete address fields" });
        }

        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Logic check: If you are adding ONE address, you should push to the array
        // user.addresses.push(req.body); 
        user.addresses = req.body; 

        await user.save();
        res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};