const User = require("../models/userModel.js")

//getCart
exports.getCart = async (req,res) =>{
    const user = await User.findById(req.user.id);
    res.json(user.cart);
}

//Add to Cart
exports.addToCart =async (req,res)=>{
    const user = await User.findById(req.user.id);
    const item = req.body ;    
}

exports.addAddress = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(req.user.id);

    user.address = req.body;

    await user.save();

    res.json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error saving address" });
  }
};