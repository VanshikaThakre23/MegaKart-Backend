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