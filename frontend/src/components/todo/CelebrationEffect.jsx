import React, { useEffect } from 'react';
import './CelebrationEffect.css';

const CelebrationEffect = ({ onDismiss }) => {
    const renderFireworks = () => {
        return Array.from({ length: 30 }).map((_, index) => {
            const left = Math.random() * 100;
            const animationDelay = Math.random() * 3;
            const animationDuration = 1 + Math.random() * 2;
            
            return (
                <div 
                    key={index}
                    className="firework"
                    style={{
                        left: `${left}%`,
                        animationDelay: `${animationDelay}s`,
                        animationDuration: `${animationDuration}s`
                    }}
                />
            );
        });
    };

    return (
        <>
            <div className="celebration-container">
                {renderFireworks()}
            </div>
            <div className="celebration-message">
                <h2>🎉 All Tasks Completed! 🎉</h2>
                <p>Congratulations! You've completed all your tasks!</p>
                <button 
                    className="dismiss-celebration"
                    onClick={onDismiss}
                >
                    Close
                </button>
            </div>
        </>
    );
};

export default CelebrationEffect;