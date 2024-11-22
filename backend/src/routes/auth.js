const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: "error logging in" });
  }
});

module.exports = router;
