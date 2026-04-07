// const express = require('express');
// const upload = require("../middleware/multer.middleware.js");
// const uploadOnCloudinary = require("../utils/cloudinary.js");

// const router = express.Router();
// const Product = require('../models/productModel');
// const fs = require("fs");

// router.get("/", async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.json(products);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: error });
//     }
// });

// router.get("/totalProducts", async (req, res) => {
//     try {
//         const totalProducts = await Product.countDocuments();
//         res.json({ totalProducts });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: error });
//     }
// });

// router.get("/popular", async (req, res) => {
//     try {
//         const product = await Product.find({ isPopular: true }).limit(10);;
//         res.json(product );
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: error });
//     }
// });


// router.get("/latest", async (req, res) => {
//     try {
//         const product = await Product.find({ isLatest: true }).limit(10);
//         res.json( product );
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: error });
//     }
// })

// router.get("/:id", async (req,res)=>{
//   try{
//     const product = await Product.findById(req.params.id)
//     res.json(product)
//   }catch(err){
//     res.status(500).json({message:err})
//   }
// });

// router.delete("/:id", async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);
//     res.json({ message: "Product deleted" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });




// router.post("/", upload.fields([
//     { name: "img", maxCount: 1 },
//     { name: "alternateimg", maxCount: 1 }
// ]), async (req, res) => {

//     try {
//         console.log("Files:", req.files);
//         console.log("Body:", req.body);

//         const imgBuffer = req.files?.img?.[0]?.buffer;
//         const imgName = req.files?.img?.[0]?.originalname;

//         if (!imgBuffer) {
//             return res.status(400).json({ message: "Primary image required" });
//         }

//         // Upload primary image
//         const imgUrl = await uploadOnCloudinary(imgBuffer, imgName);

//         // Upload alternate image (optional)
//         const altImgUrl = req.files?.alternateimg?.[0]
//             ? await uploadOnCloudinary(
//                 req.files.alternateimg[0].buffer,
//                 req.files.alternateimg[0].originalname
//               )
//             : null;

//         // Save product
//         const newProduct = await Product.create({
//             title: req.body.title,
//             category: req.body.category ? JSON.parse(req.body.category) : [],
//             subCategory: req.body.subCategory ? JSON.parse(req.body.subCategory) : [],
//             oldPrice: req.body.oldPrice,
//             newPrice: req.body.newPrice,
//             discount: req.body.discount,
//             img: imgUrl,
//             alternateimg: altImgUrl,
//             isPopular: req.body.popularSection === "true" || req.body.popularSection === true,
//             isLatest: req.body.latestSection === "true" || req.body.latestSection === true,
//         });

//         res.status(201).json(newProduct);

//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).json({ message: error.message });
//     }
// });
// module.exports = router;



const express = require('express');
const upload = require("../middleware/multer.middleware.js");
const uploadOnCloudinary = require("../utils/cloudinary.js");

const router = express.Router();
const Product = require('../models/productModel');

// ✅ GET all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }); // ✅ Sort by newest first
        console.log(`Fetched ${products.length} products`); // ✅ Debug log
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: error.message });
    }
});

// ✅ GET total product count
router.get("/totalProducts", async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        res.json({ totalProducts });
    } catch (error) {
        console.error("Error counting products:", error);
        res.status(500).json({ message: error.message });
    }
});

// ✅ GET popular products
router.get("/popular", async (req, res) => {
    try {
        const products = await Product.find({ isPopular: true }).limit(100);
        res.json(products);
    } catch (error) {
        console.error("Error fetching popular products:", error);
        res.status(500).json({ message: error.message });
    }
});

// ✅ GET latest products
router.get("/latest", async (req, res) => {
    try {
        const products = await Product.find({ isLatest: true }).limit(100);
        res.json(products);
    } catch (error) {
        console.error("Error fetching latest products:", error);
        res.status(500).json({ message: error.message });
    }
});

// ✅ GET single product by ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).json({ message: err.message });
    }
});

// ✅ DELETE product by ID
router.delete("/:id", async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully", product });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: error.message });
    }
});

// ✅ CREATE new product with images
router.post("/", upload.fields([
    { name: "img", maxCount: 1 },
    { name: "alternateimg", maxCount: 1 }
]), async (req, res) => {
    try {
        console.log("Files received:", req.files);
        console.log("Body received:", req.body);

        // ✅ Validate primary image
        const imgBuffer = req.files?.img?.[0]?.buffer;
        const imgName = req.files?.img?.[0]?.originalname;

        if (!imgBuffer) {
            return res.status(400).json({ message: "Primary image is required" });
        }

        // ✅ Upload primary image to Cloudinary
        const imgUrl = await uploadOnCloudinary(imgBuffer, imgName);
        console.log("Primary image uploaded:", imgUrl);

        // ✅ Upload alternate image (optional)
        let altImgUrl = null;
        if (req.files?.alternateimg?.[0]) {
            altImgUrl = await uploadOnCloudinary(
                req.files.alternateimg[0].buffer,
                req.files.alternateimg[0].originalname
            );
            console.log("Alternate image uploaded:", altImgUrl);
        }

        // ✅ Parse category and subCategory if they're JSON strings
        const category = typeof req.body.category === 'string'
            ? JSON.parse(req.body.category)
            : req.body.category || [];

        const subCategory = typeof req.body.subCategory === 'string'
            ? JSON.parse(req.body.subCategory)
            : req.body.subCategory || [];

        // ✅ Create product with all fields
        const newProduct = await Product.create({
            title: req.body.title,
            category,
            subCategory,
            oldPrice: parseFloat(req.body.oldPrice),
            newPrice: parseFloat(req.body.newPrice),
            discount: req.body.discount || null,
            rating: req.body.rating ? parseFloat(req.body.rating) : 4,
            img: imgUrl,
            alternateimg: altImgUrl,
            isPopular: req.body.popularSection === "true",
            isLatest: req.body.latestSection === "true",
        });

        console.log("Product created successfully:", newProduct._id);
        res.status(201).json(newProduct);

    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: error.message });
    }
});

// ✅ UPDATE product by ID
router.put("/:id", upload.fields([
    { name: "img", maxCount: 1 },
    { name: "alternateimg", maxCount: 1 }
]), async (req, res) => {
    try {
        const updateData = {
            title: req.body.title,
            oldPrice: parseFloat(req.body.oldPrice),
            newPrice: parseFloat(req.body.newPrice),
            discount: req.body.discount,
            rating: req.body.rating ? parseFloat(req.body.rating) : undefined,
            isPopular: req.body.popularSection === "true" || req.body.popularSection === true,
            isLatest: req.body.latestSection === "true" || req.body.latestSection === true,
        };

        // Parse categories
        if (req.body.category) {
            updateData.category = typeof req.body.category === 'string'
                ? JSON.parse(req.body.category)
                : req.body.category;
        }

        if (req.body.subCategory) {
            updateData.subCategory = typeof req.body.subCategory === 'string'
                ? JSON.parse(req.body.subCategory)
                : req.body.subCategory;
        }

        // Upload new images if provided
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
        console.error("Error updating product:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;