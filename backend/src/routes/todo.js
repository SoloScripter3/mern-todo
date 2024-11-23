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

//updating completed task
router.put("/:id", async (req, res) => {
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
