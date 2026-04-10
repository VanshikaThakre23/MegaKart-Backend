const express = require("express");
const router = express.Router();
const { placeOrder, getMyOrder, seeAllOrder } = require("../controllers/orderController");
const  isLoggedIn = require("../middleware/isLoggedIn"); 
const isAdmin= require("../middleware/isAdmin");

router.post("/placeOrders", isLoggedIn, placeOrder);
router.get("/myOrders", isLoggedIn, getMyOrder);
router.get("/admin/viewOrders",isAdmin,seeAllOrder);

module.exports = router;