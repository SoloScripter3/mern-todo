const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/users");

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await User.findOne({
    $or: [{ username: req.body.username }, { email: req.body.email }],
  });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    const savedUser = await user.save();
    console.log("saved", savedUser);
    return res.status(201).json({ message: "user registration completed" });
  } catch (err) {
    console.log("some error", err);
    return res.json({ message: "Internal server error" });
  }
});

module.exports = router;
