const bcrypt = require('bcrypt');
const userModel = require('../models/userModel.js');
const generateToken = require('../utils/generateToken');


module.exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const existingUser = await userModel.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User Already Exist Please Login " });


    const user = await userModel.create({ name, email, password: hashedPassword });

    let token = generateToken(user);
    res.cookie("token", token);

    res.status(201).json({ message: "User Created Successfully " });


  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "Email Incorrect User not found " });

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched)
      return res.status(409).json({ message: "Password Incorrect" });
    ;

    let token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });
    return res.status(200).json({
      message: "Yeahh you are logged in ",
      user: {
        _id: user._id,  
        email: user.email,
        role: user.role,
      }
    });

  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.logoutUser = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully " });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports.addAddress = async (req, res) => {
  try {
       if (!req.body.city || !req.body.phone) {
      return res.status(400).json({ message: "Incomplete address" });
    }

    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.addresses = req.body.addresses;   // replace whole array

    await user.save();

    res.status(200).json({ user });

  } catch (error) {

    console.log(error);
    res.status(500).json({ message: "Server error" });

  }
};

