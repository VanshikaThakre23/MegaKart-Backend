const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const isLoggedIn = async (req, res, next) => {
    try {

        console.log("Cookies:", req.cookies); 

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = isLoggedIn;