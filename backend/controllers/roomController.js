// /controllers/roomController.js
const Room = require("../models/Room");

exports.addRoom = async (req, res) => {
  try {
    const roomData = req.body;
    if (req.file) {
      roomData.image = `/uploads/${req.file.filename}`;
    }
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