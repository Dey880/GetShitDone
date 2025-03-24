import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "../css/pages/TodoList.css";

export default function TodoList() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);
    
    useEffect(() => {
        const fetchUserAndTodos = async () => {
            try {
                const userResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/user`, {
                    withCredentials: true
                });
                const userId = userResponse.data.user._id;
                setUserId(userId);
                setUser(userResponse.data.user.displayname);
                
                const todosResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/todo/${userId}`, {
                    withCredentials: true
                });
                setTodos(todosResponse.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load todos');
                setLoading(false);
            }
        };
        
        fetchUserAndTodos();
    }, []);
    
    const confirmDelete = (todoId) => {
        setConfirmingDeleteId(todoId);
    };

    const handleDelete = async (todoId) => {
        try {
            setConfirmingDeleteId(null);
            setTodos(todos.map(todo => 
                todo._id === todoId ? {...todo, deleting: true} : todo
            ));
            
            setTimeout(async () => {
                await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/todo/${todoId}`, {
                    withCredentials: true
                });
                setTodos(todos.filter(todo => todo._id !== todoId));
                setEditingTodoId(null);
            }, 500);
        } catch (err) {
            console.error('Error deleting todo:', err);
            setError('Failed to delete todo');
        }
    };

    const handleToggleComplete = async (todoId, currentStatus) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/todo/${todoId}`, {
                completed: !currentStatus
            }, {
                withCredentials: true
            });
            setTodos(todos.map(todo => 
                todo._id === todoId ? {...todo, completed: !todo.completed} : todo
            ));
        } catch (err) {
            console.error('Error updating todo status:', err);
            setError('Failed to update todo status');
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/todo`, {
                id: userId,
                title: title,
                description: description
            }, {
                withCredentials: true
            });
            setTodos([...todos, response.data.todo]);
            
            setTitle('');
            setDescription('');
            
            setIsFormVisible(false);
        } catch (err) {
            console.error('Error creating todo:', err);
            setError('Failed to create todo');
        }
    };
    
    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    const handleEditClick = (todo) => {
        setEditingTodoId(todo._id);
        setEditTitle(todo.title);
        setEditDescription(todo.description);
    };

    const handleCancelEdit = () => {
        setEditingTodoId(null);
    };

    const handleSaveEdit = async (todoId) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/todo/${todoId}`, {
                title: editTitle,
                description: editDescription
            }, {
                withCredentials: true
            });
            
            setTodos(todos.map(todo => 
                todo._id === todoId 
                    ? {...todo, title: editTitle, description: editDescription} 
                    : todo
            ));
            
            setEditingTodoId(null);
        } catch (err) {
            console.error('Error updating todo:', err);
            setError('Failed to update todo');
        }
    };
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    
    return (
        <div className="todo-container">
            <h1>Welcome, {user}!</h1>
            <h2>Get shit done today!</h2>
            
            <button 
                onClick={toggleFormVisibility} 
                className="toggle-form-button"
            >
                {isFormVisible ? '− Hide Form' : '+ Add New Todo'}
            </button>
            
            {isFormVisible && (
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
                                onClick={() => setIsFormVisible(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
            
            {todos.length === 0 ? (
                <p>No todos found</p>
            ) : (
                <ul className="todo-list">
                    {todos.map(todo => (
                        <li key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''} ${todo.deleting ? 'deleting' : ''}`}>
                            {editingTodoId === todo._id ? (
                                // Edit form
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
                                    <div className="form-buttons">
                                        <button 
                                            onClick={() => handleSaveEdit(todo._id)}
                                            className="submit-button"
                                        >
                                            Save
                                        </button>
                                        <button 
                                            onClick={handleCancelEdit}
                                            className="cancel-button"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={() => confirmDelete(todo._id)}
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
                                            onChange={() => handleToggleComplete(todo._id, todo.completed)}
                                            className="todo-checkbox"
                                        />
                                        <h3 className="todo-title">{todo.title}</h3>
                                    </div>
                                    <p className="todo-description">{todo.description}</p>
                                    <p className="todo-status">Status: {todo.completed ? 'Completed' : 'Pending'}</p>
                                    <div className="todo-actions">
                                        <button 
                                            onClick={() => handleEditClick(todo)}
                                            className="edit-button"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </>
                            )}
                            
                            {confirmingDeleteId === todo._id && (
                                <div className="delete-confirmation-overlay">
                                    <div className="delete-confirmation-modal">
                                        <h3>Are you sure?</h3>
                                        <p>Do you really want to delete this todo?</p>
                                        <div className="confirmation-buttons">
                                            <button 
                                                onClick={() => handleDelete(todo._id)}
                                                className="confirm-delete-button"
                                            >
                                                Yes, Delete
                                            </button>
                                            <button 
                                                onClick={() => setConfirmingDeleteId(null)}
                                                className="cancel-delete-button"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}