import React from 'react';

const TodoDetailsModal = ({ todo, onClose, onEdit, onToggleComplete, onDelete }) => {
    if (!todo) return null;
    
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }); // This will format as DD/MM/YYYY
    };
    
    return (
        <div className="todo-details-modal-overlay" onClick={onClose}>
            <div className="todo-details-modal" onClick={(e) => e.stopPropagation()}>
                <div className="todo-details-header">
                    <h3>{todo.title}</h3>
                    <button 
                        className="close-modal-button"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>
                
                <div className="todo-details-content">
                    <p className="todo-details-description">
                        {todo.description || 'No description provided'}
                    </p>
                    
                    <div className="todo-details-meta">
                        <div className="todo-details-meta-item">
                            <span className="meta-label">Due Date:</span>
                            <span className="meta-value">{formatDate(todo.dueDate)}</span>
                        </div>
                        
                        <div className="todo-details-meta-item">
                            <span className="meta-label">Created:</span>
                            <span className="meta-value">{formatDate(todo.createdAt)}</span>
                        </div>
                        
                        <div className="todo-details-meta-item">
                            <span className="meta-label">Priority:</span>
                            <span className={`meta-value priority-${todo.priority}`}>
                                {todo.priority || 'Medium'}
                            </span>
                        </div>
                        
                        <div className="todo-details-meta-item">
                            <span className="meta-label">Status:</span>
                            <span className="meta-value">
                                {todo.completed ? 'Completed' : 'Pending'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="todo-details-actions">
                    <button 
                        className="edit-button"
                        onClick={() => {
                            onEdit(todo);
                            onClose();
                        }}
                    >
                        Edit
                    </button>
                    <button 
                        className="toggle-complete-button"
                        onClick={() => {
                            onToggleComplete(todo._id, todo.completed);
                            onClose();
                        }}
                    >
                        {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                    </button>
                    <button 
                        className="delete-button"
                        onClick={() => {
                            onDelete(todo._id);
                            onClose();
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TodoDetailsModal;