// /models/Room.js
const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  availableRooms: { type: Number, required: true, min: 0 }
});

const roomSchema = new mongoose.Schema({
  roomName: String,
  facilities: String,
  price: Number,
  capacity: Number,
  totalRooms: Number,
  availability: [availabilitySchema], // Track availability by date
  image: String,
});

module.exports = mongoose.model("Room", roomSchema);