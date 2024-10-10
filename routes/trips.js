const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");
const auth = require("../middleware/auth");

// Crear un viaje
router.post("/", auth, async (req, res) => {
  try {
    const {
      origin,
      destination,
      date,
      time,
      transportationType,
      availableSeats,
      cost,
    } = req.body;
    const trip = new Trip({
      driver: req.user.id,
      origin,
      destination,
      date,
      time,
      transportationType,
      availableSeats,
      cost,
    });
    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Buscar viajes
router.get("/", async (req, res) => {
  try {
    const { origin, destination, transportationType } = req.query;
    let filter = {};
    if (origin) filter.origin = origin;
    if (destination) filter.destination = destination;
    if (transportationType) filter.transportationType = transportationType;
    const trips = await Trip.find(filter);
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
