const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  pincode: String,
  city: String,
  state: String,
  houseNo: String,
  area: String,
  landmark: String
})

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  addresses: [addressSchema],//isme ek se jyada address store honge qki isko array me store krrhe []
  //     cart: [
  //   {
  //     productId: String,
  //     title: String,
  //     img: String,
  //     price: Number,
  //     quantity: Number
  //   }
  // ]
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
})

module.exports = mongoose.model("user", userSchema);