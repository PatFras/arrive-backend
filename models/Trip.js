const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  transportationType: { type: String, enum: ["auto", "moto"], required: true },
  availableSeats: { type: Number, required: true },
  cost: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;
