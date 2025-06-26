// /routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  bookRoom,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} = require("../controllers/bookingController");

router.post("/", protect, bookRoom);
router.get("/my", protect, getMyBookings);
router.delete("/:id", protect, cancelBooking);
router.get("/", protect, adminOnly, getAllBookings);
router.put("/:id/status", protect, adminOnly, updateBookingStatus);

module.exports = router;
