// client/src/components/Sticker.js
// Fruit sticker component matching the original design

import React from 'react';
import FruitIllustration from './FruitIllustration';
import '../styles/Sticker.css';

function Sticker({ data }) {
    const {
        fruitType = 'tomato',
        color = '#FF6B6B',
        projectName = 'Innovation',
        location = 'Garden',
        creator = 'Gardener',
        text,
        date = new Date().toLocaleDateString()
    } = data;
    
    // Generate barcode lines
    const generateBarcodeLines = () => {
        const lines = [];
        for (let i = 0; i < 20; i++) {
            const width = Math.random() > 0.5 ? 2 : 1;
            lines.push(
                <div 
                    key={i}
                    className="barcode-line"
                    style={{ width: `${width}px` }}
                />
            );
        }
        return lines;
    };
    
    return (
        <div className="sticker" style={{ '--sticker-color': color }}>
            <div className="sticker-border">
                <div className="sticker-header">
                    <span className="fresh-text">100% FRESH</span>
                    <div className="dots">
                        <span className="dot"></span>
                        <span className="dot"></span>
                    </div>
                </div>
                
                <div className="sticker-content">
                    <div className="fruit-container">
                        <div className="fruit-icon">
                            <div className="main-fruit">
                                <FruitIllustration type={fruitType} color={color} size={120} />
                            </div>
                            <div className="lightbulb lightbulb-1">💡</div>
                            <div className="lightbulb lightbulb-2">💡</div>
                        </div>
                        
                        <div className="sparkle sparkle-1">✨</div>
                        <div className="sparkle sparkle-2">⭐</div>
                        <div className="sparkle sparkle-3">✨</div>
                        <div className="refresh-arrow">↻</div>
                    </div>
                    
                    <div className="barcode-section">
                        <div className="barcode">
                            {generateBarcodeLines()}
                        </div>
                    </div>
                </div>
                
                <div className="sticker-footer">
                    <div className="grown-by">
                        GROWN BY <span className="company">ADDX</span>
                    </div>
                    
                    <div className="project-info">
                        <div className="info-text">
                            {text || `I'm growing ${projectName} in ${location}`}
                        </div>
                        <div className="info-date">{date}</div>
                    </div>
                </div>
                
                <div className="sticker-tab">▶</div>
            </div>
        </div>
    );
}

export default Sticker;