require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/db");

const app = express();

connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`port is at http://localhost:${process.env.PORT}`);
});
