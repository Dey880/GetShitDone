import React, { useEffect, useState, useCallback } from 'react';
import "../css/pages/TodoList.css";
import api from '../utils/api';

import TodoForm from '../components/todo/TodoForm';
import TodoItem from '../components/todo/TodoItem';
import TodoCalendar from '../components/todo/TodoCalendar';
import TodoDetailsModal from '../components/todo/TodoDetailsModal';
import CelebrationEffect from '../components/todo/CelebrationEffect';

export default function TodoList() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);
    const [showCelebration, setShowCelebration] = useState(false);
    const [celebrationShown, setCelebrationShown] = useState(false);
    const [viewMode, setViewMode] = useState('list');
    const [sortBy, setSortBy] = useState('createdAt');
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [calendarTodos, setCalendarTodos] = useState({});
    const [selectedCalendarTodo, setSelectedCalendarTodo] = useState(null);
    const [showTodoDetailsModal, setShowTodoDetailsModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [showForm, setShowForm] = useState(false);

    const fetchTodos = useCallback(async (userId, sort) => {
        try {
            const todosResponse = await api.get(
                `/todo/${userId}?sortBy=${sort}`
            );
            setTodos(todosResponse.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching todos:', error);
            setError('Failed to load todos');
            setLoading(false);
        }
    }, []);

    const fetchCalendarTodos = useCallback(async (year, month, shouldMerge = false) => {
        try {
            const response = await api.get(
                `/todo/calendar/${userId}?year=${year}&month=${month}`
            );
            
            const todosByDate = {};
            response.data.forEach(todo => {
                if (todo.dueDate) {
                    const dueDate = new Date(todo.dueDate);
                    const localDate = new Date(dueDate.getTime() + dueDate.getTimezoneOffset() * 60000);
                    
                    const day = localDate.getDate();
                    const todoMonth = localDate.getMonth() + 1;
                    const todoYear = localDate.getFullYear();
                    
                    const dateKey = `${todoYear}-${todoMonth}-${day}`;
                    
                    if (!todosByDate[dateKey]) {
                        todosByDate[dateKey] = [];
                    }
                    todosByDate[dateKey].push(todo);
                }
            });
            
            if (shouldMerge) {
                setCalendarTodos(prev => ({...prev, ...todosByDate}));
            } else {
                setCalendarTodos(todosByDate);
            }
        } catch (error) {
            console.error('Error fetching calendar todos:', error);
        }
    }, [userId]);

    useEffect(() => {
        const fetchUserAndTodos = async () => {
            try {
                const userResponse = await api.get('/auth/user');
                const userId = userResponse.data.user._id;
                setUserId(userId);
                setUser(userResponse.data.user.displayname);
                
                fetchTodos(userId, sortBy);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load todos');
                setLoading(false);
            }
        };
        
        fetchUserAndTodos();
    }, [fetchTodos, sortBy]);

    useEffect(() => {
        if (userId) {
            fetchTodos(userId, sortBy);
        }
    }, [sortBy, userId, fetchTodos]);

    useEffect(() => {
        if (userId && viewMode === 'calendar') {
            fetchCalendarTodos(
                calendarDate.getFullYear(),
                calendarDate.getMonth() + 1
            );
        }
    }, [viewMode, calendarDate, userId, fetchCalendarTodos]);

    useEffect(() => {
        if (todos.length > 0 && todos.every(todo => todo.completed)) {
            if (!celebrationShown) {
                setShowCelebration(true);
                setCelebrationShown(true);
                
                const timer = setTimeout(() => {
                    setShowCelebration(false);
                }, 8000);
                
                return () => clearTimeout(timer);
            }
        } else {
            setCelebrationShown(false);
        }
    }, [todos, celebrationShown]);

    const handleAddTodo = async (todoData) => {
        try {
            const response = await api.post('/todo', {
                id: userId,
                ...todoData
            });
            
            setTodos([...todos, response.data.todo]);
            setIsFormVisible(false);
            
            if (viewMode === 'calendar') {
                fetchCalendarTodos(
                    calendarDate.getFullYear(),
                    calendarDate.getMonth() + 1
                );
            }
        } catch (err) {
            console.error('Error creating todo:', err);
            setError('Failed to create todo');
        }
    };

    const handleUpdateTodo = async (todoId, todoData) => {
        try {
            await api.put(`/todo/${todoId}`, todoData);
            
            setTodos(todos.map(todo => 
                todo._id === todoId 
                    ? { ...todo, ...todoData } 
                    : todo
            ));
            
            setEditingTodoId(null);
            
            if (viewMode === 'calendar') {
                fetchCalendarTodos(
                    calendarDate.getFullYear(),
                    calendarDate.getMonth() + 1
                );
            }
        } catch (err) {
            console.error('Error updating todo:', err);
            setError('Failed to update todo');
        }
    };

    const handleToggleComplete = async (todoId, currentStatus) => {
        try {
            await api.put(`/todo/${todoId}`, {
                completed: !currentStatus
            });
            
            setTodos(todos.map(todo => 
                todo._id === todoId ? {...todo, completed: !todo.completed} : todo
            ));
            
            if (viewMode === 'calendar') {
                fetchCalendarTodos(
                    calendarDate.getFullYear(),
                    calendarDate.getMonth() + 1
                );
            }
        } catch (err) {
            console.error('Error updating todo status:', err);
            setError('Failed to update todo status');
        }
    };

    const handleDelete = async (todoId) => {
        try {
            setConfirmingDeleteId(null);
            setTodos(todos.map(todo => 
                todo._id === todoId ? {...todo, deleting: true} : todo
            ));
            
            setTimeout(async () => {
                await api.delete(`/todo/${todoId}`);
                setTodos(todos.filter(todo => todo._id !== todoId));
                setEditingTodoId(null);
                
                if (viewMode === 'calendar') {
                    fetchCalendarTodos(
                        calendarDate.getFullYear(),
                        calendarDate.getMonth() + 1
                    );
                }
            }, 500);
        } catch (err) {
            console.error('Error deleting todo:', err);
            setError('Failed to delete todo');
        }
    };

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    const handleEditClick = (todo) => {
        setEditingTodoId(todo._id);
    };

    const handleCancelEdit = () => {
        setEditingTodoId(null);
    };

    const handleCalendarNavigate = (direction) => {
        const newDate = new Date(calendarDate);
        if (direction === 'prev') {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        setCalendarDate(newDate);
        
        fetchCalendarTodos(newDate.getFullYear(), newDate.getMonth() + 1);
    };

    const handleCalendarTodoClick = (todo) => {
        const todoToShow = {...todo};
        
        setSelectedCalendarTodo(todoToShow);
        setShowTodoDetailsModal(true);
    };

    const handleCalendarDateChange = (date) => {
        setCalendarDate(date);
        fetchCalendarTodos(date.getFullYear(), date.getMonth() + 1);
    };

    const dismissCelebration = () => {
        setShowCelebration(false);
    };

    const confirmDelete = (todoId) => {
        setConfirmingDeleteId(todoId);
    };

    const handleEditTodo = (todo) => {
        
        setIsFormVisible(false);
        
        setFormData({
            _id: todo._id,
            title: todo.title,
            description: todo.description,
            dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '',
            priority: todo.priority || 'medium',
            completed: todo.completed || false
        });
        
        setShowForm(true);
    };

    const handleDeleteTodo = async (todoId) => {
        try {
            if (window.confirm('Are you sure you want to delete this todo?')) {
                await api.delete(`/todo/${todoId}`);
                
                setTodos(todos.filter(todo => todo._id !== todoId));
                setShowTodoDetailsModal(false);
                
                if (viewMode === 'calendar') {
                    fetchCalendarTodos(
                        calendarDate.getFullYear(),
                        calendarDate.getMonth() + 1
                    );
                }
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
            setError('Failed to delete todo');
        }
    };
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    
    return (
        <div className="todo-container">
            <h1>Welcome, {user}!</h1>
            <h2>Get shit done today!</h2>
            
            <div className="view-controls">
                <div className="view-toggle">
                    <button 
                        className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                    >
                        List View
                    </button>
                    <button 
                        className={`view-button ${viewMode === 'calendar' ? 'active' : ''}`}
                        onClick={() => setViewMode('calendar')}
                    >
                        Calendar View
                    </button>
                </div>
                
                {viewMode === 'list' && (
                    <div className="sort-controls">
                        <label htmlFor="sortBy">Sort by:</label>
                        <select 
                            id="sortBy" 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="createdAt">Date Created (Newest)</option>
                            <option value="dueDate">Due Date (Ascending)</option>
                            <option value="dueDateDesc">Due Date (Descending)</option>
                            <option value="priority">Priority</option>
                        </select>
                    </div>
                )}
            </div>
            
            <button 
                onClick={toggleFormVisibility} 
                className="toggle-form-button"
            >
                {isFormVisible ? '− Hide Form' : '+ Add New Todo'}
            </button>
            
            {isFormVisible && (
                <TodoForm 
                    onSubmit={handleAddTodo}
                    onCancel={() => setIsFormVisible(false)}
                />
            )}

            {showForm && !isFormVisible && (
                <TodoForm 
                    onSubmit={(formData) => {
                        if (formData._id) {
                            handleUpdateTodo(formData._id, formData);
                        }
                        setShowForm(false);
                    }}
                    initialData={formData}
                    onCancel={() => setShowForm(false)}
                    isEditMode={true}
                />
            )}
            
            {viewMode === 'calendar' ? (
                <TodoCalendar 
                    calendarDate={calendarDate}
                    calendarTodos={calendarTodos}
                    onNavigate={handleCalendarNavigate}
                    onTodoClick={handleCalendarTodoClick}
                    onDateChange={handleCalendarDateChange}
                />
            ) : (
                todos.length === 0 ? (
                    <p>No todos found</p>
                ) : (
                    <ul className="todo-list">
                        {todos.map(todo => (
                            <TodoItem 
                                key={todo._id}
                                todo={todo}
                                isEditing={editingTodoId === todo._id}
                                isConfirmingDelete={confirmingDeleteId === todo._id}
                                onEditClick={handleEditClick}
                                onCancelEdit={handleCancelEdit}
                                onSaveEdit={handleUpdateTodo}
                                onToggleComplete={handleToggleComplete}
                                onConfirmDelete={confirmDelete}
                                onDelete={handleDelete}
                            />
                        ))}
                    </ul>
                )
            )}
            
            {showCelebration && (
                <CelebrationEffect onDismiss={dismissCelebration} />
            )}
            
            {showTodoDetailsModal && selectedCalendarTodo && (
                <TodoDetailsModal
                    todo={selectedCalendarTodo}
                    onClose={() => {
                        setShowTodoDetailsModal(false);
                        setTimeout(() => setSelectedCalendarTodo(null), 100);
                    }}
                    onEdit={handleEditTodo}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTodo}
                />
            )}
        </div>
    );
}