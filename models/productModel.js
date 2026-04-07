const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    img: { type: String, default: null },
    alternateimg: { type: String, default: null },
    category: { type: [String], required: true },
    subCategory: { type: [String], required: true },
    title: { type: String, required: true },
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    discount: { type: String },
    rating: { type: Number, default: 4 },
    isPopular: { type: Boolean, default: false },
    isLatest: { type: Boolean, default: false },
}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);