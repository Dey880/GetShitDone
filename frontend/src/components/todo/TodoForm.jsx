import React, { useState } from 'react';

const TodoForm = ({ onSubmit, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('medium');

    const formatDateForServer = (dateString) => {
        if (!dateString) return null;
        
        // Create a date object based on the input
        const date = new Date(dateString);
        // Format it as YYYY-MM-DD to ensure consistency
        return date.toISOString().split('T')[0];
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            title,
            description,
            dueDate: formatDateForServer(dueDate),
            priority
        });

        // Reset form
        setTitle('');
        setDescription('');
        setDueDate('');
        setPriority('medium');
    };

    return (
        <div className="todo-form-container">
            <h2>Add New Todo</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title" className="form-label">Title:</label>
                    <input 
                        type="text" 
                        id="title"
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description" className="form-label">Description:</label>
                    <textarea 
                        id="description"
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        className="form-textarea"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dueDate" className="form-label">Due Date:</label>
                    <input 
                        type="date" 
                        id="dueDate"
                        value={dueDate} 
                        onChange={(e) => setDueDate(e.target.value)} 
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="priority" className="form-label">Priority:</label>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="form-input"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div className="form-buttons">
                    <button 
                        type="submit"
                        className="submit-button"
                    >
                        Add Todo
                    </button>
                    <button 
                        type="button"
                        className="cancel-button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TodoForm;