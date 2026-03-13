const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    img: { type: String, default: null }, // Must be String to store the Cloudinary URL
  alternateimg: { type: String, default: null },
    category: String,
    title: String,
    oldPrice: Number,
    newPrice: Number,
    discount: String,
    rating:Number,
    isPopular:{type:Boolean, default:false,},
    isLatest:{type:Boolean, default:false,},
})


module.exports = mongoose.model("products", productSchema);

// export const product = mongoose.model("product",productSchema);