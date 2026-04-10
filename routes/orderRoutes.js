const express = require("express");
const router = express.Router();
const { placeOrder, getMyOrders, seeAllOrders } = require("../controllers/orderController");
const { isLoggedIn ,isAdmin} = require("../middleware/isLoggedIn"); // Your auth logic

router.post("/placeOrders", isLoggedIn, placeOrder);
router.get("/myOrders", isLoggedIn, getMyOrders);
router.get("/admin/viewOrders",isAdmin,seeAllOrders);

module.exports = router;