const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// Obtener perfil de usuario
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Actualizar perfil de usuario
router.put("/me", auth, async (req, res) => {
  const { name, email, preferences, location } = req.body;
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Actualizar los campos
    user.name = name || user.name;
    user.email = email || user.email;
    user.preferences = preferences || user.preferences;
    user.location = location || user.location;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
