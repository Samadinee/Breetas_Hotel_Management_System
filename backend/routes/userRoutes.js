// /routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile-images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.put("/profile", protect, upload.single('profileImage'), async (req, res) => {
  try {
    const { username, email } = req.body;
    const updateData = { username, email };
    
    if (req.file) {
      updateData.profileImage = `/uploads/profile-images/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select("-password");
    
    res.json({ 
      success: true,
      user,
      profileImage: user.profileImage
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;