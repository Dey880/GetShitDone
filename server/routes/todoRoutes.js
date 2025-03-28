const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController.js');

router.get('/:id', todoController.getTodos);
router.get('/calendar/:id', todoController.getTodosByMonth);
router.post('/', todoController.createTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;