// /controllers/bookingController.js
const Booking = require("../models/Booking");
const Room = require("../models/Room");

exports.bookRoom = async (req, res) => {
  const { roomId, numberOfPersons, phoneNumber, checkInDate, checkOutDate } = req.body;
  const userId = req.user._id;

  try {
    const room = await Room.findById(roomId);
    if (!room || room.availableRooms < 1) {
      return res.status(400).json({ message: "No available rooms" });
    }

    // Convert dates to Date objects
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkIn >= checkOut) {
      return res.status(400).json({ message: "Check-out date must be after check-in date" });
    }

    // Find all bookings for this room that overlap with the requested date range
    const overlappingBookings = await Booking.find({
      roomId,
      $or: [
        { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }
      ]
    });

    // For each date in the requested range, check if the total booked persons exceeds availableRooms
    let canBook = true;
    let errorDate = null;
    for (
      let d = new Date(checkIn);
      d < checkOut;
      d.setDate(d.getDate() + 1)
    ) {
      let personsBooked = 0;
      overlappingBookings.forEach(b => {
        // If this booking covers this date
        if (d >= b.checkInDate && d < b.checkOutDate) {
          personsBooked += b.numberOfPersons;
        }
      });
      if (personsBooked + Number(numberOfPersons) > room.availableRooms) {
        canBook = false;
        errorDate = new Date(d);
        break;
      }
    }

    if (!canBook) {
      return res.status(400).json({ message: `Room is fully booked for at least one day in your selected range (${errorDate.toISOString().slice(0,10)})` });
    }

    const totalPrice = numberOfPersons * room.price;

    const booking = await Booking.create({
      userId,
      roomId,
      numberOfPersons,
      phoneNumber,
      checkInDate,
      checkOutDate,
      totalPrice
    });

    // Optionally, you may want to update availableRooms only if you want to track per-day availability
    // await room.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id }).populate("roomId");
  res.json(bookings);
};

exports.cancelBooking = async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, userId: req.user._id });
  if (!booking) return res.status(404).json({ message: "Booking not found" });

  const room = await Room.findById(booking.roomId);
  room.availableRooms += 1;
  await room.save();

  await booking.remove();
  res.json({ message: "Booking cancelled" });
};

exports.getAllBookings = async (req, res) => {
  const bookings = await Booking.find().populate("userId roomId");
  res.json(bookings);
};

exports.updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) return res.status(404).json({ message: "Booking not found" });

  booking.status = status;
  await booking.save();

  res.json(booking);
};