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

router.get("/totalProducts", async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        res.json({ totalProducts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
});

router.get("/popular", async (req, res) => {
    try {
        const product = await Product.find({ isPopular: true }).limit(10);;
        res.json(product );
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
});


router.get("/latest", async (req, res) => {
    try {
        const product = await Product.find({ isLatest: true }).limit(10);
        res.json( product );
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
})

router.get("/:id", async (req,res)=>{
  try{
    const product = await Product.findById(req.params.id)
    res.json(product)
  }catch(err){
    res.status(500).json({message:err})
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



router.post("/", upload.fields([
    { name: "img", maxCount: 1 },
    { name: "alternateimg", maxCount: 1 }
]), async (req, res) => {

    console.log("Files received:", req.files); //jo image  aayi h vo 
    console.log("Body received:", req.body);//image chhodkr baki ka data jo aaya hai 
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
            category: JSON.parse(req.body.category),
            oldPrice: req.body.oldPrice,
            newPrice: req.body.newPrice,
            discount: req.body.discount,
            img: imgUrl,
            alternateimg: altImgUrl,
            isPopular: req.body.popularSection === "true",
            isLatest: req.body.latestSection === "true",
        });

        res.status(201).json(newProduct);

    } catch (error) {
        console.error("Route Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;