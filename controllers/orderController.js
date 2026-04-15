const orderModel = require("../models/orderModel.js");

exports.placeOrder = async (req, res) => {
    try {
        const { items, addresses, totalAmount, paymentMethod } = req.body;
        const newOrder = new orderModel({
            user: req.user._id,
            items,
            addresses,
            totalAmount,
            paymentMethod,
        })

        await newOrder.save();
        res.status(200).json({ success: true, data: newOrder });

    } catch (error) {
        res.json({ message: "error", error: error.message })
    }
}

exports.getMyOrder = async (req, res) => {
    try {

        const order = await orderModel.find({ user: req.user._id }).populate("items.product").sort({ createdAt: -1 });;
        res.json({ success: true, data: order });
    } catch (error) {
        res.json(error);
    }
}

exports.seeAllOrder = async (req, res) => {
    try {
        const order = await orderModel.find().populate("user").populate("items.product").populate("addresses");
        res.json({ success: true, data: order });
    } catch (error) {
        res.json(error);
    }
}