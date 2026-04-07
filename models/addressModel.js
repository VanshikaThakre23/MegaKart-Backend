const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  houseNo: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Address", addressSchema);