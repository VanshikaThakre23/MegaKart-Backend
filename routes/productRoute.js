const express = require('express');
const upload = require("../middleware/multer.middleware.js");
const uploadOnCloudinary = require("../utils/cloudinary.js");

const router = express.Router();
const Product = require('../models/productModel');
const fs = require("fs");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
});


router.post("/", upload.fields([
    { name: "img", maxCount: 1 },
    { name: "alternateimg", maxCount: 1 }
]), async (req, res) => {
    try {
        // 1. Check if files exist in the request
        const imgLocalPath = req.files?.img?.[0]?.path;
        const altImgLocalPath = req.files?.alternateimg?.[0]?.path;

        if (!imgLocalPath) {
            return res.status(400).json({ message: "Primary image is required" });
        }

        // 2. Upload to Cloudinary
        const imgUrl = await uploadOnCloudinary(imgLocalPath);
        const altImgUrl = altImgLocalPath ? await uploadOnCloudinary(altImgLocalPath) : null;

        // 3. Create database entry with the Cloudinary URLs
        const newProduct = await Product.create({
            title: req.body.title,
            category: req.body.category,
            oldPrice: req.body.oldPrice,
            newPrice: req.body.newPrice,
            discount: req.body.discount,
            img: imgUrl,           // This is the secure_url from Cloudinary
            alternateimg: altImgUrl
        });

        res.status(201).json(newProduct);
        
    } catch (error) {
        console.error("Route Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;