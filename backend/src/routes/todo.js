const express = require("express");
const router = express.Router();
const Todo = require("../models/todos");
const authMiddleware = require("../middlewares/authMiddleware");

//getting all todos
router.get("/", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user });
    return res.json(todos);
  } catch (err) {
    return res.json({ message: "not found" });
  }
});

//adding todo
router.post("/add", authMiddleware, async (req, res) => {
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

//updating completed task
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updates = {};
    if (req.body.title !== undefined) {
      updates.title = req.body.title;
    }
    if (req.body.completed !== undefined) {
      updates.completed = req.body.completed;
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      updates,
      { new: true }
    );

    if (!todo) {
      return res.json({ message: "Todo is not found" });
    }

    return res.json({ message: todo });
  } catch (err) {
    return res.json({ message: "error in updating todo" });
  }
});

//delete route
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });
    if (!todo) {
      return res.json({ message: "No todo is found" });
    }
    return res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    return res.json({ message: "error occured during deletion" });
  }
});

module.exports = router;
