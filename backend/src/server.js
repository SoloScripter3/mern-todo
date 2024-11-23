require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");

const app = express();

connectDB();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`port is at http://localhost:${process.env.PORT}`);
});
