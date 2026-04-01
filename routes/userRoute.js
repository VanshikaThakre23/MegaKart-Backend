const express = require('express');
const isLoggedIn = require("../middleware/isLoggedIn");
const { registerUser, loginUser, logoutUser, addAddress } = require('../controllers/authControllers');
const User = require('../models/userModel');
const router = express.Router();


router.get('/user', (req, res) => {
  res.send('user route');
})

router.get("/me", isLoggedIn, (req, res) => {
  res.status(200).json({ user: req.user });
});

router.get("/totalUser", async (req, res) => {
  try {
    const totalUser = await User.countDocuments();
    res.json({ totalUser });
  }
  catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/viewUser", async (req, res) => {
  try {
    const allUserDetails = await User.find().select("name email addresses");
    res.json({ users: allUserDetails });

  } catch (error) {
    res.status(500).json({ message: error });
  }
})

router.get("/cart", isLoggedIn, async (req, res) => {
  try {
    const user = await User.findById(req.user.id,).populate("cart.product")
    res.json(user.cart)
  } catch (error) {
    res.status(500).json({ meaage: error.message });
  }

});

router.get("/wishlist",isLoggedIn, async (req,res)=>{
  const user = await User.findById(req.user.id).populate("wishlist");
  res.json(user.wishlist);
})

router.post("/add-to-cart", isLoggedIn, async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user.id);

    const existingItem = user.cart.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();

    res.json({ message: "Added to cart", cart: user.cart });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.post("/add-address", isLoggedIn, addAddress)

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

module.exports = router;