import React, { useState } from 'react';

const TodoItem = ({ 
    todo, 
    isEditing, 
    isConfirmingDelete, 
    onEditClick, 
    onCancelEdit, 
    onSaveEdit, 
    onToggleComplete, 
    onConfirmDelete, 
    onDelete 
}) => {
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editDueDate, setEditDueDate] = useState('');
    const [editPriority, setEditPriority] = useState('');

    // Initialize edit states when entering edit mode
    React.useEffect(() => {
        if (isEditing) {
            setEditTitle(todo.title);
            setEditDescription(todo.description || '');
            setEditDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '');
            setEditPriority(todo.priority || 'medium');
        }
    }, [isEditing, todo]);

    const formatDateForServer = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleSaveEdit = () => {
        onSaveEdit(todo._id, {
            title: editTitle,
            description: editDescription,
            dueDate: formatDateForServer(editDueDate),
            priority: editPriority
        });
    };

    return (
        <li className={`todo-item ${todo.completed ? 'completed' : ''} ${todo.deleting ? 'deleting' : ''} priority-${todo.priority || 'medium'}`}>
            {isEditing ? (
                <div className="todo-edit-form">
                    <div className="form-group">
                        <label htmlFor={`edit-title-${todo._id}`} className="form-label">Title:</label>
                        <input 
                            type="text" 
                            id={`edit-title-${todo._id}`}
                            value={editTitle} 
                            onChange={(e) => setEditTitle(e.target.value)} 
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`edit-desc-${todo._id}`} className="form-label">Description:</label>
                        <textarea 
                            id={`edit-desc-${todo._id}`}
                            value={editDescription} 
                            onChange={(e) => setEditDescription(e.target.value)} 
                            className="form-textarea"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`edit-due-${todo._id}`} className="form-label">Due Date:</label>
                        <input 
                            type="date" 
                            id={`edit-due-${todo._id}`}
                            value={editDueDate} 
                            onChange={(e) => setEditDueDate(e.target.value)} 
                            className="form-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`edit-priority-${todo._id}`} className="form-label">Priority:</label>
                        <select
                            id={`edit-priority-${todo._id}`}
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value)}
                            className="form-input"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div className="form-buttons">
                        <button 
                            onClick={handleSaveEdit}
                            className="submit-button"
                        >
                            Save
                        </button>
                        <button 
                            onClick={onCancelEdit}
                            className="cancel-button"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={() => onConfirmDelete(todo._id)}
                            className="delete-button"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="todo-header">
                        <input 
                            type="checkbox" 
                            checked={todo.completed} 
                            onChange={() => onToggleComplete(todo._id, todo.completed)}
                            className="todo-checkbox"
                        />
                        <h3 className="todo-title">{todo.title}</h3>
                    </div>
                    <p className="todo-description">{todo.description}</p>
                    {todo.dueDate && (
                        <p className="todo-due-date">
                            Due: {new Date(todo.dueDate).toLocaleDateString()}
                        </p>
                    )}
                    <div className="todo-meta">
                        <p className="todo-status">Status: {todo.completed ? 'Completed' : 'Pending'}</p>
                        <p className="todo-priority">Priority: {todo.priority || 'Medium'}</p>
                    </div>
                    <div className="todo-actions">
                        <button 
                            onClick={() => onEditClick(todo)}
                            className="edit-button"
                        >
                            Edit
                        </button>
                    </div>
                </>
            )}
            
            {isConfirmingDelete && (
                <div className="delete-confirmation-overlay">
                    <div className="delete-confirmation-modal">
                        <h3>Are you sure?</h3>
                        <p>Do you really want to delete this todo?</p>
                        <div className="confirmation-buttons">
                            <button 
                                onClick={() => onDelete(todo._id)}
                                className="confirm-delete-button"
                            >
                                Yes, Delete
                            </button>
                            <button 
                                onClick={() => onConfirmDelete(null)}
                                className="cancel-delete-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </li>
    );
};

export default TodoItem;