
const dotenv = require ('dotenv');
dotenv.config();
const mongoose = require('mongoose');

const fs = require("fs");
const path = require("path")

const cors = require('cors');
const cookieParser = require('cookie-parser');

// express setup 
const express = require ('express');
const app = express();

// .env things
const PORT  = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Done!!!!! mongodb connected"))
.catch((err)=>console.log(err));


// router path
const userRouter = require('./routes/userRoute.js');
const productRouter = require('./routes/productRoute.js');
const addressRouter = require('./routes/addressRoutes.js');
const orderRouter = require('./routes/orderRoutes.js');

// Backend: server.js or app.js
const cors = require('cors');

app.use(cors({
  origin: 'https://megakart.netlify.app',
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// middleware stup
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("hello user");
});

app.use("/user" , userRouter);
app.use("/products", productRouter);
app.use("/address",addressRouter);
app.use("/order",orderRouter);

const uploadDir = path.join(__dirname,"uploads");
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir,{recursive:true});
    console.log("Created uploads directory")
}

app.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`);
})