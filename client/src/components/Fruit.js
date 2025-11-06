// client/src/components/Fruit.js
// Animated fruit component for the garden

import React from 'react';
import '../styles/Fruit.css';

function Fruit({ type = 'apple', size = 'medium', animated = true, glowing = false }) {
    // Map fruit types to emoji
    const fruitEmojis = {
        tomato: '🍅',
        apple: '🍎',
        orange: '🍊',
        grape: '🍇',
        strawberry: '🍓',
        cherry: '🍒',
        peach: '🍑',
        watermelon: '🍉',
        banana: '🍌',
        pineapple: '🍍',
        mango: '🥭',
        kiwi: '🥝',
        avocado: '🥑',
        corn: '🌽',
        carrot: '🥕',
        broccoli: '🥦',
        pepper: '🌶️',
        cucumber: '🥒',
        lettuce: '🥬',
        mushroom: '🍄',
        lemon: '🍋',
        coconut: '🥥',
        blueberry: '🫐',
        eggplant: '🍆',
        potato: '🥔'
    };
    
    const fruitEmoji = fruitEmojis[type] || fruitEmojis.apple;
    
    // Size classes
    const sizeClasses = {
        small: 'fruit-small',
        medium: 'fruit-medium',
        large: 'fruit-large',
        xlarge: 'fruit-xlarge'
    };
    
    const sizeClass = sizeClasses[size] || sizeClasses.medium;
    
    return (
        <div 
            className={`
                fruit 
                ${sizeClass} 
                ${animated ? 'fruit-animated' : ''} 
                ${glowing ? 'fruit-glowing' : ''}
            `}
        >
            <span className="fruit-emoji">{fruitEmoji}</span>
            
            {glowing && (
                <>
                    <div className="glow-ring glow-ring-1"></div>
                    <div className="glow-ring glow-ring-2"></div>
                    <div className="glow-ring glow-ring-3"></div>
                </>
            )}
        </div>
    );
}

export default Fruit;

