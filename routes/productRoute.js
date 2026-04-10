const express = require("express");
const upload = require("../middleware/multer.middleware.js");
const uploadOnCloudinary = require("../utils/cloudinary.js");
const Product = require("../models/productModel");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/totalProducts", async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        res.json({ totalProducts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/popular", async (req, res) => {
    try {
        const products = await Product.find({ isPopular: true }).limit(100);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/latest", async (req, res) => {
    try {
        const products = await Product.find({ isLatest: true }).limit(100);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post(
    "/",
    upload.fields([
        { name: "img", maxCount: 1 },
        { name: "alternateimg", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const imgBuffer = req.files?.img?.[0]?.buffer;
            const imgName = req.files?.img?.[0]?.originalname;

            if (!imgBuffer) {
                return res.status(400).json({ message: "Primary image is required" });
            }

            const imgUrl = await uploadOnCloudinary(imgBuffer, imgName);

            let altImgUrl = null;
            if (req.files?.alternateimg?.[0]) {
                altImgUrl = await uploadOnCloudinary(
                    req.files.alternateimg[0].buffer,
                    req.files.alternateimg[0].originalname
                );
            }

            const category =
                typeof req.body.category === "string"
                    ? JSON.parse(req.body.category)
                    : req.body.category || [];

            const subCategory =
                typeof req.body.subCategory === "string"
                    ? JSON.parse(req.body.subCategory)
                    : req.body.subCategory || [];

            const newProduct = await Product.create({
                title: req.body.title,
                category,
                subCategory,
                oldPrice: parseFloat(req.body.oldPrice),
                newPrice: parseFloat(req.body.newPrice),
                discount: req.body.discount || null,
                img: imgUrl,
                alternateimg: altImgUrl,
                isPopular: req.body.popularSection === "true",
                isLatest: req.body.latestSection === "true",
            });

            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

router.put(
    "/:id",
    upload.fields([
        { name: "img", maxCount: 1 },
        { name: "alternateimg", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const updateData = {
                title: req.body.title,
                oldPrice: parseFloat(req.body.oldPrice),//parsefloar string ko floarting me convert krta hai  
                newPrice: parseFloat(req.body.newPrice),
                discount: req.body.discount,
                isPopular: req.body.popularSection === "true" || req.body.popularSection === true,
                isLatest:  req.body.latestSection === "true" || req.body.latestSection === true,
            };

            if (req.body.category) {
                updateData.category =
                    typeof req.body.category === "string"
                        ? JSON.parse(req.body.category)
                        : req.body.category;
            }

            if (req.body.subCategory) {
                updateData.subCategory =typeof req.body.subCategory === "string"
                        ? JSON.parse(req.body.subCategory)
                        : req.body.subCategory;
            }

            if (req.files?.img?.[0]) {
                updateData.img = await uploadOnCloudinary(
                    req.files.img[0].buffer,
                    req.files.img[0].originalname
                );
            }

            if (req.files?.alternateimg?.[0]) {
                updateData.alternateimg = await uploadOnCloudinary(
                    req.files.alternateimg[0].buffer,
                    req.files.alternateimg[0].originalname
                );
            }

            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!updatedProduct) {
                return res.status(404).json({ message: "Product not found" });
            }

            res.json(updatedProduct);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

module.exports = router;