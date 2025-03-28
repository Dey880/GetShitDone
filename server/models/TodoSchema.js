const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const TodoSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    completed: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    dueDate: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' }
});

const Todo = model('Todo', TodoSchema);
module.exports = Todo;