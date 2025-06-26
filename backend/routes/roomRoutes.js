// /routes/roomRoutes.js
const express = require("express");
const router = express.Router();
const { addRoom, getRooms, updateRoom, deleteRoom, getRoomAvailability, getRoomById } = require("../controllers/roomController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.get("/", getRooms);
router.post("/", protect, adminOnly, upload.single("image"), addRoom);
router.put("/:id", protect, adminOnly, upload.single("image"), updateRoom);
router.delete("/:id", protect, adminOnly, deleteRoom);
router.get("/:id/availability", getRoomAvailability);
router.get("/:id", getRoomById); // <-- Add this line

module.exports = router;
