const cloudinary = require("cloudinary").v2;
const fs = require("fs");

// configure cloudinary using .env variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;
    const fixedPath = filePath.replace(/\\/g, "/");
    const result = await cloudinary.uploader.upload(fixedPath, {
      folder: "ecommerce_products",
    });

    // Remove file from local storage after successful upload
    fs.unlinkSync(filePath); 
    
    return result.secure_url;
  } catch (error) {
    // Also remove file if upload fails to keep storage clean
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.log("Cloudinary Upload Error:", error);
    return null;
  }
};

module.exports = uploadOnCloudinary;