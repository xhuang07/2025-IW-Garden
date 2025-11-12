// client/src/components/DynamicSticker.js
// Reusable animated SVG sticker component

import React, { useState, useEffect } from 'react';
import { generateStickerFromFiles, generateStickerSVG } from '../utils/stickerGenerator';

function DynamicSticker({ 
  projectAdjective, 
  projectFeeling, 
  location = '', 
  size = 'medium',
  animated = true,
  className = ''
}) {
  const [stickerSVG, setStickerSVG] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    generateSticker();
  }, [projectAdjective, projectFeeling, location]);
  
  const generateSticker = async () => {
    if (!projectAdjective || !projectFeeling) {
      setError(true);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(false);
    
    try {
      // Try to generate from SVG files first
      let svg = await generateStickerFromFiles(
        projectAdjective,
        projectFeeling,
        location,
        animated
      );
      
      // Fallback to programmatic generation if files not available
      if (!svg) {
        console.log('⚠️ DynamicSticker: Falling back to programmatic generation');
        svg = generateStickerSVG(
          projectAdjective,
          projectFeeling,
          location
        );
      }
      
      setStickerSVG(svg);
    } catch (err) {
      console.error('❌ DynamicSticker: Error generating sticker:', err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Size classes mapping
  const sizeStyles = {
    small: { width: '150px', height: '150px' },
    medium: { width: '280px', height: '280px' },
    large: { width: '400px', height: '400px' }
  };
  
  const containerStyle = {
    ...sizeStyles[size],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible'
  };
  
  if (isLoading) {
    return (
      <div className={`dynamic-sticker-loading ${className}`} style={containerStyle}>
        <div style={{ fontSize: '2rem', opacity: 0.5 }}>⏳</div>
      </div>
    );
  }
  
  if (error || !stickerSVG) {
    return (
      <div className={`dynamic-sticker-error ${className}`} style={containerStyle}>
        <div style={{ fontSize: '3rem', opacity: 0.3 }}>🍎</div>
      </div>
    );
  }
  
  return (
    <div 
      className={`dynamic-sticker ${className}`}
      style={containerStyle}
      dangerouslySetInnerHTML={{ __html: stickerSVG }}
    />
  );
}

export default DynamicSticker;

