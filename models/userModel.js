const mongoose = require('mongoose');



const userSchema = mongoose.Schema({
  name: String,
  email: String,
  phone:String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },

  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pzroduct"
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