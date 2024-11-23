const express = require("express");
const router = express.Router();
const Todo = require("../models/todos");

//getting all todos
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user });
    return res.json(todos);
  } catch (err) {
    return res.json({ message: "not found" });
  }
});

//adding todo
router.post("/add", auth, async (req, res) => {
  try {
    const newTodo = new Todo({
      title: req.body.title,
      user: req.user,
    });
    const savedTodo = await newTodo.save();
    return res.json({ message: savedTodo });
  } catch (err) {
    return res.json({ message: "something went wrong" });
  }
});
