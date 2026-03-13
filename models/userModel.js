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
    name:String,
    email:String,
    password:String,
    role:{
        type:String,
        enum:["admin","user"],
        default:"user",
    },
    addresses:[addressSchema],//isme ek se jyada address store honge qki isko array me store krrhe []
})

module.exports = mongoose.model("user",userSchema);