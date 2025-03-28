import React from 'react';

const TodoCalendar = ({ calendarDate, calendarTodos, onNavigate, onTodoClick }) => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const monthName = calendarDate.toLocaleString('default', { month: 'long' });
    
    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    // Get the last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0);
    // Get the day of the week of the first day (0 = Sunday, 6 = Saturday)
    const firstDayWeekday = firstDayOfMonth.getDay();
    // Get the number of days in the month
    const daysInMonth = lastDayOfMonth.getDate();
    
    // Create days array
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
        days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add cells for each day in the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayTodos = calendarTodos[day] || [];
        const maxVisibleTodos = 3; // Limit number of visible todos to prevent deformation
        const hasMoreTodos = dayTodos.length > maxVisibleTodos;
        
        days.push(
            <div key={`day-${day}`} className="calendar-day">
                <div className="calendar-date">{day}</div>
                <div className="calendar-todos">
                    {dayTodos.length > 0 ? (
                        <>
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
                                <div className="calendar-more-todos" onClick={(e) => {
                                    e.stopPropagation();
                                    // Could add functionality to show all todos for this day
                                }}>
                                    +{dayTodos.length - maxVisibleTodos} more
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="no-todos"></div>
                    )}
                </div>
            </div>
        );
    }
    
    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={() => onNavigate('prev')}>&lt;</button>
                <h3>{monthName} {year}</h3>
                <button onClick={() => onNavigate('next')}>&gt;</button>
            </div>
            <div className="calendar-weekdays">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
            </div>
            <div className="calendar-days">
                {days}
            </div>
        </div>
    );
};

export default TodoCalendar;