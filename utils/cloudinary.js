const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// configure cloudinary using .env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (fileBuffer, originalName) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "ecommerce_products",
                public_id: `product_${Date.now()}_${originalName}`,
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        
        uploadStream.end(fileBuffer);
    });
};

module.exports = uploadOnCloudinary;