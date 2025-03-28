import React, { useState, useEffect } from 'react';
import './TodoForm.css';

const TodoForm = ({ onSubmit, onCancel, initialData = {}, isEditMode = false }) => {
    const [title, setTitle] = useState(initialData.title || '');
    const [description, setDescription] = useState(initialData.description || '');
    const [dueDate, setDueDate] = useState(initialData.dueDate || '');
    const [priority, setPriority] = useState(initialData.priority || 'medium');
    
    useEffect(() => {
        if (initialData.title) setTitle(initialData.title);
        if (initialData.description) setDescription(initialData.description);
        if (initialData.dueDate) setDueDate(initialData.dueDate);
        if (initialData.priority) setPriority(initialData.priority);
    }, [initialData]);

    const formatDateForServer = (dateString) => {
        if (!dateString) return null;
        
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            _id: initialData._id,
            title,
            description,
            dueDate: formatDateForServer(dueDate),
            priority
        });

        if (!isEditMode) {
            setTitle('');
            setDescription('');
            setDueDate('');
            setPriority('medium');
        }
    };

    return (
        <div className="todo-form-container">
            <h2>{isEditMode ? 'Edit Todo' : 'Add New Todo'}</h2>
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
                    <label htmlFor="priority" className="form-label">Priority</label>
                    <select
                        id="priority"
                        className="form-select"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
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
                        {isEditMode ? 'Save Changes' : 'Add Todo'}
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