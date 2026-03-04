const express = require('express');
const isLoggedIn = require("../middleware/isLoggedIn");
const { registerUser, loginUser, logoutUser, addAddress } = require('../controllers/authControllers');
const router = express.Router();



router.get('/user',(req,res)=>{
res.send('user route');
})

router.get("/me", isLoggedIn, (req, res) => {
  res.status(200).json({ user: req.user });
});

router.post("/add-address",isLoggedIn,addAddress )

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/logout", logoutUser);

module.exports = router;