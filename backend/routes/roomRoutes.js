const express = require("express");
const { getRoomById, createRoom } = require("../controllers/roomController");

const router = express.Router();

// Route to get a room by ID
router.get("/:roomId", getRoomById);

// Route to create a new room
router.post("/", createRoom);

module.exports = router;
