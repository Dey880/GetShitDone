import React, { useState } from 'react';
import './TodoCalendar.css';

const TodoCalendar = ({ calendarDate, calendarTodos, onNavigate, onTodoClick, onDateChange }) => {
    const currentDate = new Date(calendarDate);
    const [dateInput, setDateInput] = useState(
        currentDate.toISOString().split('T')[0]
    );
    
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const monthYearFormatted = currentDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });
    
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    const days = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const handleDateInputChange = (e) => {
        setDateInput(e.target.value);
    };
    
    const handleGoToDate = () => {
        if (dateInput) {
            onDateChange(new Date(dateInput));
        }
    };
    
    const handleGoToToday = () => {
        const today = new Date();
        setDateInput(today.toISOString().split('T')[0]);
        onDateChange(today);
    };
    
    const weekdayHeaders = weekdays.map(day => (
        <div key={`header-${day}`} className="calendar-weekday-header">{day}</div>
    ));
    
    const maxVisibleTodos = 3;
    
    for (let i = 0; i < firstDayOfWeek; i++) {
        days.push(
            <div key={`empty-${i}`} className="calendar-day empty"></div>
        );
    }
    
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        const dayNum = i;
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        
        const dateKey = `${year}-${month}-${dayNum}`;
        const dayTodos = (calendarTodos[dateKey] || []);
        const hasMoreTodos = dayTodos.length > maxVisibleTodos;
        
        const isToday = new Date().toDateString() === dayDate.toDateString();
        
        days.push(
            <div key={`day-${i}`} className={`calendar-day ${isToday ? 'today' : ''}`}>
                <div className="calendar-date">
                    <span className="day-number">{dayNum}</span>
                </div>
                <div className="calendar-todos">
                    {dayTodos.slice(0, maxVisibleTodos).map(todo => (
                        <div 
                            key={todo._id} 
                            className={`calendar-todo ${todo.completed ? 'completed' : ''} priority-${todo.priority}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onTodoClick(todo);
                            }}
                        >
                            <span className="todo-title">{todo.title}</span>
                        </div>
                    ))}
                    {hasMoreTodos && (
                        <div className="calendar-more-todos">
                            +{dayTodos.length - maxVisibleTodos} more
                        </div>
                    )}
                </div>
            </div>
        );
    }
    
    return (
        <div className="calendar-container month-view">
            <div className="calendar-header">
                <div className="calendar-nav">
                    <button onClick={() => onNavigate('prev')} className="calendar-nav-button">&lt;</button>
                    <h3>{monthYearFormatted}</h3>
                    <button onClick={() => onNavigate('next')} className="calendar-nav-button">&gt;</button>
                </div>
                
                <div className="calendar-date-controls">
                    <input 
                        type="date" 
                        value={dateInput}
                        onChange={handleDateInputChange}
                        className="calendar-date-input"
                    />
                    <button onClick={handleGoToDate} className="calendar-go-button">Go</button>
                    <button onClick={handleGoToToday} className="calendar-today-button">Today</button>
                </div>
            </div>
            
            <div className="calendar-weekdays">
                {weekdayHeaders}
            </div>
            
            <div className="calendar-days month-view">
                {days}
            </div>
        </div>
    );
};

export default TodoCalendar;