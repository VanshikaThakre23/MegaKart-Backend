const dotenv = require ('dotenv');
dotenv.config();
const mongoose = require('mongoose');

const cors = require('cors');
const cookieParser = require('cookie-parser');

// express setup 
const express = require ('express');
const app = express();

// .env things
const PORT  = process.env.PORT ;
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Yahhhhoooo!!!!! mongodb connected"))
.catch((err)=>console.log(err));


// router path
const userRouter = require('./routes/userRoute.js');

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

// middleware stup
app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("hello user");
});

app.use("/user" , userRouter);

app.listen(PORT, ()=>{
    console.log(`server running on ${PORT}`);
})