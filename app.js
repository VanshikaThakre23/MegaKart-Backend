const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const fs = require("fs");
const path = require("path");
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Database Connection
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Done!!!!! mongodb connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// CORS Configuration - Must be the FIRST middleware
app.use(cors({
  origin: 'https://megakart.netlify.app', // No trailing slash
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Standard Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static Files (for uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const userRouter = require('./routes/userRoute.js');
const productRouter = require('./routes/productRoute.js');
const addressRouter = require('./routes/addressRoutes.js');
const orderRouter = require('./routes/orderRoutes.js');

app.use("/user", userRouter);
app.use("/products", productRouter);
app.use("/address", addressRouter);
app.use("/order", orderRouter);

app.get("/", (req, res) => {
  res.send("MegaKart Backend is running...");
});

// Ensure Uploads Directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created uploads directory");
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});