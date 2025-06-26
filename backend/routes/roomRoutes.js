// /routes/roomRoutes.js
const express = require("express");
const router = express.Router();
const { addRoom, getRooms, updateRoom, deleteRoom } = require("../controllers/roomController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

router.get("/", getRooms);
router.post("/", protect, adminOnly, upload.single("image"), addRoom);
router.put("/:id", protect, adminOnly, upload.single("image"), updateRoom);
router.delete("/:id", protect, adminOnly, deleteRoom);

module.exports = router;
