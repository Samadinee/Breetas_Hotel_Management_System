// /controllers/roomController.js
const Room = require("../models/Room");

exports.addRoom = async (req, res) => {
  try {
    const roomData = req.body;
    if (req.file) {
      roomData.image = `/uploads/${req.file.filename}`;
    }
    
    // Initialize with empty availability
    roomData.availability = [];
    const room = await Room.create(roomData);
    
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getRooms = async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
};

exports.updateRoom = async (req, res) => {
  try {
    const updateData = req.body;
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    const room = await Room.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteRoom = async (req, res) => {
  await Room.findByIdAndDelete(req.params.id);
  res.json({ message: "Room deleted" });
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getRoomAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const dateObj = new Date(date);
    const availabilityRecord = room.availability.find(a => 
      a.date.toISOString().split('T')[0] === dateObj.toISOString().split('T')[0]
    );

    const availableRooms = availabilityRecord ? 
      availabilityRecord.availableRooms : 
      room.totalRooms;

    res.json(availableRooms);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};