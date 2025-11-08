// client/src/components/Fruit.js
// Animated flower shape component for the garden

import React from 'react';
import FruitIllustration from './FruitIllustration';
import '../styles/Fruit.css';

function Fruit({ type = 'shape1', size = 'medium', animated = true, glowing = false, color }) {
    // Check if it's a shape (flower) or old fruit type
    const isShape = type && type.startsWith('shape');
    
    // Map shape types to their SVG files
    const getShapePath = (shapeType) => {
        const shapeNumber = shapeType.replace('shape', '');
        return `/shapes/Shape ${shapeNumber}.svg`;
    };
    
    // Default colors for shapes using new palette
    const defaultColors = {
        shape1: '#FEA57D',
        shape2: '#ABC9EF',
        shape3: '#ECC889',
        shape4: '#7992B1',
        shape5: '#F0A8F6',
        shape6: '#829E86',
        shape7: '#CCBF84',
        shape8: '#FEFFFE',
        shape9: '#D9AD99',
        shape10: '#BBBEA0',
        shape11: '#FEA57D',
        shape12: '#ABC9EF',
        shape13: '#ECC889',
        shape14: '#7992B1',
        shape15: '#F0A8F6'
    };
    
    const fruitColor = color || defaultColors[type] || defaultColors.shape1;
    
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
            <div className="fruit-illustration" style={{ width: '100%', height: '100%' }}>
                {isShape ? (
                    <img 
                        src={getShapePath(type)} 
                        alt={type}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                        }}
                    />
                ) : (
                    <FruitIllustration type={type} color={fruitColor} size={sizeValue} />
                )}
            </div>
            
            {glowing && (
                <>
                    <div className="glow-ring glow-ring-1" style={{ borderColor: fruitColor }}></div>
                    <div className="glow-ring glow-ring-2" style={{ borderColor: fruitColor }}></div>
                    <div className="glow-ring glow-ring-3" style={{ borderColor: fruitColor }}></div>
                </>
            )}
        </div>
    );
}

export default Fruit;

