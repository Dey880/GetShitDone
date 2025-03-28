import React, { useEffect, useState } from 'react';
import './TodoDetailsModal.css';

const TodoDetailsModal = ({ todo, onClose, onEdit, onToggleComplete, onDelete }) => {
    const [justOpened, setJustOpened] = useState(true);
    
    useEffect(() => {
        if (todo) {
            document.body.style.overflow = 'hidden';
            
            const timer = setTimeout(() => {
                setJustOpened(false);
            }, 300);
            
            return () => {
                clearTimeout(timer);
                document.body.style.overflow = 'auto';
            };
        }
    }, [todo]);
    
    if (!todo) return null;
    
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    
    const handleModalClick = (e) => {
        e.stopPropagation();
    };
    
    const handleOverlayClick = (e) => {
        if (!justOpened) {
            onClose();
        } else {
            e.preventDefault();
            e.stopPropagation();
        }
    };
    
    return (
        <div 
            className="todo-details-modal-overlay" 
            onClick={handleOverlayClick}
        >
            <div 
                className="todo-details-modal" 
                onClick={handleModalClick}
                style={{position: 'relative'}}
            >
                
                <div className="todo-details-header">
                    <h3>{todo.title}</h3>
                    <button 
                        className="close-modal-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
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
                        onClick={(e) => {
                            e.stopPropagation();
                            if (typeof onEdit === 'function') {
                                onEdit(todo);
                            } else {
                                console.error('onEdit is not a function');
                            }
                            onClose();
                        }}
                    >
                        Edit
                    </button>
                    <button 
                        className="toggle-complete-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleComplete(todo._id, todo.completed);
                            onClose();
                        }}
                    >
                        {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
                    </button>
                    <button 
                        className="delete-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (typeof onDelete === 'function') {
                                onDelete(todo._id);
                            } else {
                                console.error('onDelete is not a function');
                            }
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