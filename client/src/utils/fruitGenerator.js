// client/src/utils/fruitGenerator.js
// Logic for generating fruit types based on Mad Libs selections

/**
 * Generate a fruit type and color based on adjective and feeling selections
 * @param {string} adjective - Selected adjective from Mad Libs
 * @param {string} feeling - Selected feeling from Mad Libs
 * @param {string} projectName - Name of the project (optional, for additional logic)
 * @returns {object} - Object with fruitType and color
 */
export function generateFruitType(adjective, feeling, projectName = '') {
    // Fruit mapping based on adjective + feeling combinations
    const fruitMappings = {
        // Revolutionary, Innovative, Disruptive -> Tech fruits
        'Revolutionary': {
            default: { type: 'apple', color: '#FF6B6B' },
            'Excited': { type: 'strawberry', color: '#FF4757' },
            'Inspired': { type: 'cherry', color: '#E84393' },
            'Energized': { type: 'watermelon', color: '#FF6348' },
            'Empowered': { type: 'tomato', color: '#FF6B6B' },
            'Motivated': { type: 'pepper', color: '#FF5722' }
        },
        'Innovative': {
            default: { type: 'orange', color: '#FFA500' },
            'Excited': { type: 'mango', color: '#FFA500' },
            'Inspired': { type: 'peach', color: '#FFB07C' },
            'Energized': { type: 'pineapple', color: '#FFD700' },
            'Empowered': { type: 'corn', color: '#F9CA24' },
            'Motivated': { type: 'lemon', color: '#F7DC6F' }
        },
        'Disruptive': {
            default: { type: 'grape', color: '#9B59B6' },
            'Excited': { type: 'blueberry', color: '#5F27CD' },
            'Inspired': { type: 'eggplant', color: '#6C5CE7' },
            'Energized': { type: 'grape', color: '#8E44AD' },
            'Empowered': { type: 'mushroom', color: '#95A5A6' },
            'Motivated': { type: 'grape', color: '#A29BFE' }
        },
        
        // Fresh, Bold -> Vibrant fruits
        'Fresh': {
            default: { type: 'kiwi', color: '#A8E6CF' },
            'Excited': { type: 'cucumber', color: '#55E6C1' },
            'Inspired': { type: 'lettuce', color: '#8BC34A' },
            'Energized': { type: 'avocado', color: '#8FBF7F' },
            'Empowered': { type: 'broccoli', color: '#00B894' },
            'Motivated': { type: 'kiwi', color: '#A8E6CF' },
            'Refreshed': { type: 'cucumber', color: '#7BED9F' },
            'Invigorated': { type: 'lettuce', color: '#8BC34A' }
        },
        'Bold': {
            default: { type: 'pepper', color: '#FF5722' },
            'Excited': { type: 'strawberry', color: '#FF4757' },
            'Inspired': { type: 'tomato', color: '#FF6B6B' },
            'Energized': { type: 'watermelon', color: '#FF6348' },
            'Empowered': { type: 'cherry', color: '#E84393' },
            'Motivated': { type: 'pepper', color: '#EE5A6F' }
        },
        
        // Crispy, Juicy, Ripe -> Classic fruits
        'Crispy': {
            default: { type: 'apple', color: '#FF6B6B' },
            'Excited': { type: 'apple', color: '#E74C3C' },
            'Inspired': { type: 'carrot', color: '#F39C12' },
            'Refreshed': { type: 'lettuce', color: '#2ECC71' },
            'Invigorated': { type: 'broccoli', color: '#27AE60' }
        },
        'Juicy': {
            default: { type: 'orange', color: '#FFA500' },
            'Excited': { type: 'mango', color: '#FFC300' },
            'Inspired': { type: 'peach', color: '#FFB07C' },
            'Refreshed': { type: 'watermelon', color: '#FF6B9D' },
            'Energized': { type: 'pineapple', color: '#FFD93D' }
        },
        'Ripe': {
            default: { type: 'banana', color: '#F9CA24' },
            'Excited': { type: 'mango', color: '#FFA502' },
            'Inspired': { type: 'peach', color: '#FFB6C1' },
            'Empowered': { type: 'papaya', color: '#FF9F43' }
        },
        
        // Organic, Sustainable -> Green/eco fruits
        'Organic': {
            default: { type: 'avocado', color: '#8FBF7F' },
            'Excited': { type: 'kiwi', color: '#A8E6CF' },
            'Inspired': { type: 'lettuce', color: '#8BC34A' },
            'Empowered': { type: 'broccoli', color: '#00B894' },
            'Refreshed': { type: 'cucumber', color: '#7BED9F' }
        },
        'Sustainable': {
            default: { type: 'broccoli', color: '#00B894' },
            'Excited': { type: 'lettuce', color: '#8BC34A' },
            'Inspired': { type: 'avocado', color: '#6AB04C' },
            'Empowered': { type: 'cucumber', color: '#00D2D3' },
            'Motivated': { type: 'kiwi', color: '#A8E6CF' }
        },
        
        // Electric, Magnetic, Quantum, Neural, Atomic -> High-tech fruits
        'Electric': {
            default: { type: 'banana', color: '#F9CA24' },
            'Excited': { type: 'lemon', color: '#FEF65B' },
            'Energized': { type: 'pineapple', color: '#FFD93D' },
            'Charged': { type: 'corn', color: '#F9CA24' }
        },
        'Magnetic': {
            default: { type: 'grape', color: '#A29BFE' },
            'Excited': { type: 'blueberry', color: '#6C5CE7' },
            'Inspired': { type: 'eggplant', color: '#5F27CD' }
        },
        'Quantum': {
            default: { type: 'grape', color: '#9B59B6' },
            'Excited': { type: 'blueberry', color: '#5F27CD' },
            'Enlightened': { type: 'eggplant', color: '#6C5CE7' },
            'Transformed': { type: 'mushroom', color: '#B8B5FF' }
        },
        'Neural': {
            default: { type: 'coconut', color: '#D6D6D6' },
            'Excited': { type: 'potato', color: '#D4A574' },
            'Inspired': { type: 'mushroom', color: '#BDC3C7' },
            'Enlightened': { type: 'coconut', color: '#ECF0F1' }
        },
        'Atomic': {
            default: { type: 'pepper', color: '#FF5722' },
            'Excited': { type: 'strawberry', color: '#FF4757' },
            'Energized': { type: 'tomato', color: '#FF6B6B' },
            'Charged': { type: 'cherry', color: '#E84393' }
        }
    };
    
    // Get the fruit based on adjective and feeling
    let result;
    
    if (adjective && fruitMappings[adjective]) {
        const adjectiveMap = fruitMappings[adjective];
        
        if (feeling && adjectiveMap[feeling]) {
            result = adjectiveMap[feeling];
        } else {
            result = adjectiveMap.default;
        }
    } else {
        // Default fallback
        result = { type: 'apple', color: '#FF6B6B' };
    }
    
    // Add some randomness for variety
    const shouldAddVariation = Math.random() > 0.7;
    if (shouldAddVariation) {
        result = addColorVariation(result);
    }
    
    return {
        fruitType: result.type,
        color: result.color
    };
}

/**
 * Add slight color variation to make each fruit unique
 * @param {object} fruit - Fruit object with type and color
 * @returns {object} - Fruit with slightly modified color
 */
function addColorVariation(fruit) {
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };
    
    const rgbToHex = (r, g, b) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };
    
    const rgb = hexToRgb(fruit.color);
    if (!rgb) return fruit;
    
    // Add/subtract up to 20 from each channel
    const variation = 20;
    const newR = Math.max(0, Math.min(255, rgb.r + Math.floor(Math.random() * variation * 2 - variation)));
    const newG = Math.max(0, Math.min(255, rgb.g + Math.floor(Math.random() * variation * 2 - variation)));
    const newB = Math.max(0, Math.min(255, rgb.b + Math.floor(Math.random() * variation * 2 - variation)));
    
    return {
        type: fruit.type,
        color: rgbToHex(newR, newG, newB)
    };
}

/**
 * Get a random fruit and color
 * @returns {object} - Random fruit object
 */
export function getRandomFruit() {
    const fruits = [
        { type: 'apple', color: '#FF6B6B' },
        { type: 'orange', color: '#FFA500' },
        { type: 'grape', color: '#9B59B6' },
        { type: 'strawberry', color: '#FF4757' },
        { type: 'banana', color: '#F9CA24' },
        { type: 'kiwi', color: '#A8E6CF' },
        { type: 'watermelon', color: '#FF6B9D' },
        { type: 'cherry', color: '#E84393' },
        { type: 'pineapple', color: '#FFD93D' },
        { type: 'mango', color: '#FFA502' }
    ];
    
    return fruits[Math.floor(Math.random() * fruits.length)];
}

/**
 * Get all available fruit types
 * @returns {array} - Array of all fruit types
 */
export function getAllFruitTypes() {
    return [
        'apple', 'orange', 'grape', 'strawberry', 'banana', 
        'kiwi', 'watermelon', 'cherry', 'pineapple', 'mango',
        'tomato', 'avocado', 'lemon', 'peach', 'blueberry',
        'pepper', 'broccoli', 'lettuce', 'cucumber', 'corn',
        'carrot', 'mushroom', 'eggplant', 'coconut', 'potato'
    ];
}

