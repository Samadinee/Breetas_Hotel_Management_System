// /routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  bookRoom,
  getMyBookings,
  cancelBooking,
  getAllBookings,
} = require("../controllers/bookingController");

router.post("/", protect, bookRoom);
router.get("/my", protect, getMyBookings);
router.delete("/:id", protect, cancelBooking);
router.get("/", protect, adminOnly, getAllBookings);

module.exports = router;
