const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name:String,
    desc:String,
    image:[String],
    price:{
        oldPrice:{
            type:Number,
        },
        newPrice:{
            type:Number,
            required:true,
        }
    },
    offer:String,
    category:String,
    
})

module.exports = mongoose.model("product",productSchema);