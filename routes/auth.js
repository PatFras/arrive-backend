const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const { check, validationResult } = require("express-validator");
const { handleErrors } = require("../utils/errorHandler");

// Registro
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("role", "Role must be either conductor, pasajero, or ambos").isIn([
      "conductor",
      "pasajero",
      "ambos",
    ]),
    check(
      "preferences.transportationType",
      "Transportation type must be either auto or moto"
    ).isIn(["auto", "moto"]),
    check(
      "preferences.distance",
      "Distance must be either corta or larga"
    ).isIn(["corta", "larga"]),
    check("location.city", "City is required").not().isEmpty(),
    check("location.province", "Province is required").not().isEmpty(),
    check("location.country", "Country is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: handleErrors(errors) });
    }

    try {
      const { name, email, password, role, preferences, location } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      user = new User({ name, email, password, role, preferences, location });
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Inicio de sesión
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: handleErrors(errors) });
    }

    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
