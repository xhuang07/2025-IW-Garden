// client/src/components/Fruit.js
// Animated fruit component for the garden

import React from 'react';
import FruitIllustration from './FruitIllustration';
import '../styles/Fruit.css';

function Fruit({ type = 'apple', size = 'medium', animated = true, glowing = false, color }) {
    // Map fruit types to colors if not provided
    const defaultColors = {
        tomato: '#E74C3C',
        apple: '#E74C3C',
        orange: '#F39C12',
        grape: '#8E44AD',
        strawberry: '#E74C3C',
        cherry: '#C0392B',
        peach: '#FFDAB9',
        watermelon: '#27AE60',
        banana: '#F1C40F',
        pineapple: '#F39C12',
        mango: '#F39C12',
        kiwi: '#A8E6CF',
        avocado: '#6AB04C',
        corn: '#F9CA24',
        carrot: '#E67E22',
        broccoli: '#27AE60',
        pepper: '#E74C3C',
        cucumber: '#27AE60',
        lettuce: '#27AE60',
        mushroom: '#BDC3C7',
        lemon: '#F4E04D',
        coconut: '#8B7355',
        blueberry: '#5F27CD',
        eggplant: '#6C5CE7',
        potato: '#C7956D'
    };
    
    const fruitColor = color || defaultColors[type] || defaultColors.apple;
    
    // Size mapping to pixel values
    const sizeValues = {
        small: 60,
        medium: 80,
        large: 120,
        xlarge: 160
    };
    
    const sizeValue = sizeValues[size] || sizeValues.medium;
    
    return (
        <div 
            className={`
                fruit 
                fruit-${size}
                ${animated ? 'fruit-animated' : ''} 
                ${glowing ? 'fruit-glowing' : ''}
            `}
        >
            <div className="fruit-illustration">
                <FruitIllustration type={type} color={fruitColor} size={sizeValue} />
            </div>
            
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

