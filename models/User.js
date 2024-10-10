const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["conductor", "pasajero", "ambos"],
    default: "pasajero",
  },
  preferences: {
    transportationType: {
      type: String,
      enum: ["auto", "moto"],
      default: "auto",
    },
    distance: { type: String, enum: ["corta", "larga"], default: "corta" },
  },
  location: {
    city: String,
    province: String,
    country: String,
  },
  createdAt: { type: Date, default: Date.now },
});

// Middleware para hashear la contraseña antes de guardar
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
