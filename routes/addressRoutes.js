const express = require("express");
const router = express.Router();
const Address = require("../models/addressModel"); 
const { isLoggedIn } = require("../middleware/auth.middleware.js");
const User = require("../models/userModel");

router.post("/giveAddress", isLoggedIn, async (req, res) => {
  try {
    const { fullName, phone, pincode, city, state, houseNo, area } = req.body;

    // Validation
    if (!fullName || !phone || !pincode || !city || !state || !houseNo || !area) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const newAddress = await Address.create({
      user: req.user._id, 
      fullName,
      phone,
      pincode,
      city,
      state,
      houseNo,
      area
    });

    await User.findByIdAndUpdate(req.user._id,{
      $push:{addresses : newAddress._id}
    })

    res.status(201).json({
      success: true,
      message: "Address saved successfully",
      data: newAddress
    });

  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save address"
    });
  }
});

// Get all addresses of logged-in user
router.get("/myAddress", isLoggedIn, async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id })
      .sort({ createdAt: -1 }); // Latest first

    res.status(200).json({
      success: true,
      data: addresses
    });

  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses"
    });
  }
});

//  Update address by ID
router.put("/updateAddress/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phone, pincode, city, state, houseNo, area } = req.body;

    // Find address and check ownership
    const address = await Address.findById(id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    //checking that address user ka hi hai kya
    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this address"
      });
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      { fullName, phone, pincode, city, state, houseNo, area },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updatedAddress
    });

  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update address"
    });
  }
});

router.delete("/deleteAddress/:id", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findById(id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    // Security = user ka hi address hai naa confirmm
    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this address"
      });
    }

    await Address.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Address deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete address"
    });
  }
});

module.exports = router;