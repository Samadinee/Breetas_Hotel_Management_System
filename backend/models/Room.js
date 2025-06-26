// /models/Room.js
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomName: String,
  facilities: String,
  price: Number,
  capacity: Number,
  totalRooms: Number,
  availableRooms: Number,
  image: String, // Path to uploaded image
});

module.exports = mongoose.model("Room", roomSchema);
