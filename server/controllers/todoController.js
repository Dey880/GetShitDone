const Todo = require('../models/TodoSchema.js');

const todoController = {
    getTodos: async (req, res) => {
        const { id } = req.params;
        const { sortBy, startDate, endDate } = req.query;
        
        try {
            let query = { user: id };
            
            if (startDate && endDate) {
                query.dueDate = { 
                    $gte: new Date(startDate), 
                    $lte: new Date(endDate) 
                };
            } else if (startDate) {
                query.dueDate = { $gte: new Date(startDate) };
            } else if (endDate) {
                query.dueDate = { $lte: new Date(endDate) };
            }
            
            let todosQuery = Todo.find(query);
            
            if (sortBy === 'dueDate') {
                todosQuery = todosQuery.sort({ dueDate: 1 });
            } else if (sortBy === 'dueDateDesc') {
                todosQuery = todosQuery.sort({ dueDate: -1 });
            } else if (sortBy === 'priority') {
                todosQuery = todosQuery.sort({ priority: -1 });
            } else if (sortBy === 'createdAt') {
                todosQuery = todosQuery.sort({ createdAt: 1 });
            } else {
                todosQuery = todosQuery.sort({ createdAt: -1 });
            }
            
            const todos = await todosQuery.exec();
            res.status(200).send(todos);
        } catch (error) {
            console.error(error);
            res.status(500).send({ msg: 'Internal server error', error: error });
        }
    },
    
    getTodosByMonth: async (req, res) => {
        const { id } = req.params;
        const { year, month } = req.query;
        
        try {
            const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const endDate = new Date(parseInt(year), parseInt(month), 0);
            
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 59, 999);
            
            const todos = await Todo.find({
                user: id,
                dueDate: { $gte: startDate, $lte: endDate }
            });
            
            res.status(200).send(todos);
        } catch (error) {
            console.error(error);
            res.status(500).send({ msg: 'Internal server error', error: error });
        }
    },
    
    createTodo: async (req, res) => {
        const { title, description, id, dueDate, priority } = req.body;
        try {
            const todo = new Todo({
                title: title,
                description: description,
                completed: false,
                user: id,
                dueDate: dueDate || null,
                priority: priority || 'medium',
                createdAt: new Date()
            });
            await todo.save();
            res.status(201).send({ msg: 'Todo created successfully', todo: todo });
        } catch (error) {
            console.error(error);
            res.status(500).send({ msg: 'Internal server error', error: error });
        }
    },
    
    updateTodo: async (req, res) => {
        const { title, description, completed, dueDate, priority } = req.body;
        const { id } = req.params;
        try {
            const todo = await Todo.findOneAndUpdate(
                { _id: id }, 
                {
                    title,
                    description,
                    completed,
                    dueDate,
                    priority
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