const express = require("express");
const router = express.Router();
const {
  getAllTasks, getTask, createTask, updateTask, toggleComplete, deleteTask
} = require("../controllers/taskController");

router.get("/",          getAllTasks);
router.get("/:id",       getTask);
router.post("/",         createTask);
router.put("/:id",       updateTask);
router.patch("/:id/toggle", toggleComplete);
router.delete("/:id",    deleteTask);

module.exports = router;
