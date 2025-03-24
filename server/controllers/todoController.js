const Todo = require('../models/TodoSchema.js');

const todoController = {
    getTodos: async (req, res) => {
        const { id } = req.params;
        try {
            const todos = await Todo.find({ user: id });
            res.status(200).send(todos);
        } catch (error) {
            console.error(error);
            res.status(500).send({ msg: 'Internal server error', error: error });
        }
    },
    createTodo: async (req, res) => {
        const { title, description, id } = req.body;
        try {
            const todo = new Todo({
                title: title,
                description: description,
                completed: false,
                user: id,

            });
            todo.save();
            res.status(201).send({ msg: 'Todo created successfully', todo: todo });
        } catch (error) {
            console.error(error);
            res.status(500).send({ msg: 'Internal server error', error: error });
        }
    },
    updateTodo: async (req, res) => {
        const { title, description, completed } = req.body;
        const { id } = req.params;
        try {
            const todo = await Todo.findOneAndUpdate(
                { _id: id }, 
                {
                    title,
                    description,
                    completed,
                },
                { new: true }
            );
            res.status(200).send({ msg: 'Todo updated successfully', todo: todo });
        } catch (error) {
            console.error(error);
            res.status(500).send({ msg: 'Internal server error', error: error });
        }
    },
    deleteTodo: async (req, res) => {
        const { id } = req.params
        try {
            const todo = await Todo.findOneAndDelete({ _id: id });
            res.status(200).send({ msg: 'Todo deleted successfully', todo: todo });
        } catch (error) {
            console.error(error);
            res.status(500).send({ msg: 'Internal server error', error: error });
        }
    },
};

module.exports = todoController;