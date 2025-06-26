// backend/controllers/bookingController.js
const Booking = require("../models/Booking");
const Room = require("../models/Room");

exports.bookRoom = async (req, res) => {
  const { roomId, numberOfPersons, phoneNumber, checkInDate, checkOutDate } = req.body;
  const userId = req.user._id;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Convert dates to Date objects
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    if (checkIn >= checkOut) {
      return res.status(400).json({ message: "Check-out date must be after check-in date" });
    }

    // Check availability for each date in the range
    const dateAvailability = {};
    const datesToCheck = [];
    
    // Generate all dates in the range
    for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      datesToCheck.push(new Date(d));
      
      // Find availability record for this date
      const availability = room.availability.find(a => 
        a.date.toISOString().split('T')[0] === dateStr
      );
      
      // If no record exists, assume all rooms are available
      dateAvailability[dateStr] = availability ? availability.availableRooms : room.totalRooms;
    }

    // Check if room is available for all dates
    for (const dateStr in dateAvailability) {
      if (dateAvailability[dateStr] < 1) {
        return res.status(400).json({ 
          message: `Room is not available on ${dateStr}` 
        });
      }
    }

    // Calculate total price
    const totalPrice = numberOfPersons * room.price * datesToCheck.length;

    // Create booking
    const booking = await Booking.create({
      userId,
      roomId,
      numberOfPersons,
      phoneNumber,
      checkInDate,
      checkOutDate,
      totalPrice
    });

    // Update availability for each date
    for (const date of datesToCheck) {
      const dateStr = date.toISOString().split('T')[0];
      const availabilityIndex = room.availability.findIndex(a => 
        a.date.toISOString().split('T')[0] === dateStr
      );

      if (availabilityIndex >= 0) {
        room.availability[availabilityIndex].availableRooms -= 1;
      } else {
        room.availability.push({
          date,
          availableRooms: room.totalRooms - 1
        });
      }
    }

    await room.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update other booking controller methods as needed...

exports.getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id }).populate("roomId");
  res.json(bookings);
};

// /controllers/bookingController.js
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const room = await Room.findById(booking.roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Generate all dates in the booking range
    const datesToRestore = [];
    for (let d = new Date(booking.checkInDate); d < new Date(booking.checkOutDate); d.setDate(d.getDate() + 1)) {
      datesToRestore.push(new Date(d));
    }

    // Restore availability for each date
    for (const date of datesToRestore) {
      const dateStr = date.toISOString().split('T')[0];
      const availabilityIndex = room.availability.findIndex(a => 
        a.date.toISOString().split('T')[0] === dateStr
      );

      if (availabilityIndex >= 0) {
        room.availability[availabilityIndex].availableRooms += 1;
        
        // Remove availability record if it's back to total rooms
        if (room.availability[availabilityIndex].availableRooms >= room.totalRooms) {
          room.availability.splice(availabilityIndex, 1);
        }
      }
    }

    await room.save();
    await booking.remove();

    res.json({ message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
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