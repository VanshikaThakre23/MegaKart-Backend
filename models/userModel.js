const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  phone:String,
  password: String,
  role:{
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  addresses:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Address",
    
  }],
  
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
