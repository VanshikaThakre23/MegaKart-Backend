const mongoose = require("mongoose")

const orderSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    items:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            },
            quantity:{
                type:Number,
                default:1,
            },
        }
    ],
    addresses:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Address"
    },
    totalAmount:{
        type:Number,
        required:true,
    },
    paymentMethod:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        default:"Pending",
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

module.exports = mongoose.model("Order",orderSchema);