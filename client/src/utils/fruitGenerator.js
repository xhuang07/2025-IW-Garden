// client/src/utils/fruitGenerator.js
// Logic for generating flower shapes based on Mad Libs selections

/**
 * Generate a flower shape and color based on adjective and feeling selections
 * @param {string} adjective - Selected adjective from Mad Libs
 * @param {string} feeling - Selected feeling from Mad Libs
 * @param {string} projectName - Name of the project (optional, for additional logic)
 * @returns {object} - Object with fruitType (shape number) and color
 */
export function generateFruitType(adjective, feeling, projectName = '') {
    // New color palette - map feelings to colors
    const feelingColors = {
        'Excited': '#FEA57D',      // Coral/orange - energetic
        'Inspired': '#ABC9EF',     // Light blue - calm inspiration
        'Energized': '#ECC889',    // Warm gold - bright energy
        'Empowered': '#7992B1',    // Strong blue - power
        'Motivated': '#F0A8F6',    // Pink/magenta - vibrant
        'Refreshed': '#829E86',    // Green - fresh
        'Invigorated': '#CCBF84',  // Gold - vibrant
        'Enlightened': '#FEFFFE',  // Off-white - enlightened
        'Transformed': '#D9AD99',  // Peachy - transformation
        'Charged': '#BBBEA0'       // Olive/tan - grounded energy
    };
    
    // Map adjectives to flower shapes (Shape 1-15)
    const adjectiveToShapeMap = {
        'Revolutionary': 'shape1',
        'Innovative': 'shape2',
        'Disruptive': 'shape3',
        'Fresh': 'shape4',
        'Bold': 'shape5',
        'Crispy': 'shape6',
        'Juicy': 'shape7',
        'Ripe': 'shape8',
        'Organic': 'shape9',
        'Sustainable': 'shape10',
        'Electric': 'shape11',
        'Magnetic': 'shape12',
        'Quantum': 'shape13',
        'Neural': 'shape14',
        'Atomic': 'shape15'
    };
    
    // Flower mapping based on adjective + feeling combinations
    const fruitMappings = {
        // Revolutionary, Innovative, Disruptive -> Tech shapes
        'Revolutionary': {
            default: { type: 'shape1', color: '#FEA57D' },
            'Excited': { type: 'shape1', color: '#FEA57D' },
            'Inspired': { type: 'shape1', color: '#ABC9EF' },
            'Energized': { type: 'shape1', color: '#ECC889' },
            'Empowered': { type: 'shape1', color: '#7992B1' },
            'Motivated': { type: 'shape1', color: '#F0A8F6' },
            'Refreshed': { type: 'shape1', color: '#829E86' },
            'Invigorated': { type: 'shape1', color: '#CCBF84' },
            'Enlightened': { type: 'shape1', color: '#FEFFFE' },
            'Transformed': { type: 'shape1', color: '#D9AD99' },
            'Charged': { type: 'shape1', color: '#BBBEA0' }
        },
        'Innovative': {
            default: { type: 'shape2', color: '#FEA57D' },
            'Excited': { type: 'shape2', color: '#FEA57D' },
            'Inspired': { type: 'shape2', color: '#ABC9EF' },
            'Energized': { type: 'shape2', color: '#ECC889' },
            'Empowered': { type: 'shape2', color: '#7992B1' },
            'Motivated': { type: 'shape2', color: '#F0A8F6' },
            'Refreshed': { type: 'shape2', color: '#829E86' },
            'Invigorated': { type: 'shape2', color: '#CCBF84' },
            'Enlightened': { type: 'shape2', color: '#FEFFFE' },
            'Transformed': { type: 'shape2', color: '#D9AD99' },
            'Charged': { type: 'shape2', color: '#BBBEA0' }
        },
        'Disruptive': {
            default: { type: 'shape3', color: '#FEA57D' },
            'Excited': { type: 'shape3', color: '#FEA57D' },
            'Inspired': { type: 'shape3', color: '#ABC9EF' },
            'Energized': { type: 'shape3', color: '#ECC889' },
            'Empowered': { type: 'shape3', color: '#7992B1' },
            'Motivated': { type: 'shape3', color: '#F0A8F6' },
            'Refreshed': { type: 'shape3', color: '#829E86' },
            'Invigorated': { type: 'shape3', color: '#CCBF84' },
            'Enlightened': { type: 'shape3', color: '#FEFFFE' },
            'Transformed': { type: 'shape3', color: '#D9AD99' },
            'Charged': { type: 'shape3', color: '#BBBEA0' }
        },
        
        // Fresh, Bold -> Vibrant shapes
        'Fresh': {
            default: { type: 'shape4', color: '#FEA57D' },
            'Excited': { type: 'shape4', color: '#FEA57D' },
            'Inspired': { type: 'shape4', color: '#ABC9EF' },
            'Energized': { type: 'shape4', color: '#ECC889' },
            'Empowered': { type: 'shape4', color: '#7992B1' },
            'Motivated': { type: 'shape4', color: '#F0A8F6' },
            'Refreshed': { type: 'shape4', color: '#829E86' },
            'Invigorated': { type: 'shape4', color: '#CCBF84' },
            'Enlightened': { type: 'shape4', color: '#FEFFFE' },
            'Transformed': { type: 'shape4', color: '#D9AD99' },
            'Charged': { type: 'shape4', color: '#BBBEA0' }
        },
        'Bold': {
            default: { type: 'shape5', color: '#FEA57D' },
            'Excited': { type: 'shape5', color: '#FEA57D' },
            'Inspired': { type: 'shape5', color: '#ABC9EF' },
            'Energized': { type: 'shape5', color: '#ECC889' },
            'Empowered': { type: 'shape5', color: '#7992B1' },
            'Motivated': { type: 'shape5', color: '#F0A8F6' },
            'Refreshed': { type: 'shape5', color: '#829E86' },
            'Invigorated': { type: 'shape5', color: '#CCBF84' },
            'Enlightened': { type: 'shape5', color: '#FEFFFE' },
            'Transformed': { type: 'shape5', color: '#D9AD99' },
            'Charged': { type: 'shape5', color: '#BBBEA0' }
        },
        
        // Crispy, Juicy, Ripe -> Classic shapes
        'Crispy': {
            default: { type: 'shape6', color: '#FEA57D' },
            'Excited': { type: 'shape6', color: '#FEA57D' },
            'Inspired': { type: 'shape6', color: '#ABC9EF' },
            'Energized': { type: 'shape6', color: '#ECC889' },
            'Empowered': { type: 'shape6', color: '#7992B1' },
            'Motivated': { type: 'shape6', color: '#F0A8F6' },
            'Refreshed': { type: 'shape6', color: '#829E86' },
            'Invigorated': { type: 'shape6', color: '#CCBF84' },
            'Enlightened': { type: 'shape6', color: '#FEFFFE' },
            'Transformed': { type: 'shape6', color: '#D9AD99' },
            'Charged': { type: 'shape6', color: '#BBBEA0' }
        },
        'Juicy': {
            default: { type: 'shape7', color: '#FEA57D' },
            'Excited': { type: 'shape7', color: '#FEA57D' },
            'Inspired': { type: 'shape7', color: '#ABC9EF' },
            'Energized': { type: 'shape7', color: '#ECC889' },
            'Empowered': { type: 'shape7', color: '#7992B1' },
            'Motivated': { type: 'shape7', color: '#F0A8F6' },
            'Refreshed': { type: 'shape7', color: '#829E86' },
            'Invigorated': { type: 'shape7', color: '#CCBF84' },
            'Enlightened': { type: 'shape7', color: '#FEFFFE' },
            'Transformed': { type: 'shape7', color: '#D9AD99' },
            'Charged': { type: 'shape7', color: '#BBBEA0' }
        },
        'Ripe': {
            default: { type: 'shape8', color: '#FEA57D' },
            'Excited': { type: 'shape8', color: '#FEA57D' },
            'Inspired': { type: 'shape8', color: '#ABC9EF' },
            'Energized': { type: 'shape8', color: '#ECC889' },
            'Empowered': { type: 'shape8', color: '#7992B1' },
            'Motivated': { type: 'shape8', color: '#F0A8F6' },
            'Refreshed': { type: 'shape8', color: '#829E86' },
            'Invigorated': { type: 'shape8', color: '#CCBF84' },
            'Enlightened': { type: 'shape8', color: '#FEFFFE' },
            'Transformed': { type: 'shape8', color: '#D9AD99' },
            'Charged': { type: 'shape8', color: '#BBBEA0' }
        },
        
        // Organic, Sustainable -> Green/eco shapes
        'Organic': {
            default: { type: 'shape9', color: '#FEA57D' },
            'Excited': { type: 'shape9', color: '#FEA57D' },
            'Inspired': { type: 'shape9', color: '#ABC9EF' },
            'Energized': { type: 'shape9', color: '#ECC889' },
            'Empowered': { type: 'shape9', color: '#7992B1' },
            'Motivated': { type: 'shape9', color: '#F0A8F6' },
            'Refreshed': { type: 'shape9', color: '#829E86' },
            'Invigorated': { type: 'shape9', color: '#CCBF84' },
            'Enlightened': { type: 'shape9', color: '#FEFFFE' },
            'Transformed': { type: 'shape9', color: '#D9AD99' },
            'Charged': { type: 'shape9', color: '#BBBEA0' }
        },
        'Sustainable': {
            default: { type: 'shape10', color: '#FEA57D' },
            'Excited': { type: 'shape10', color: '#FEA57D' },
            'Inspired': { type: 'shape10', color: '#ABC9EF' },
            'Energized': { type: 'shape10', color: '#ECC889' },
            'Empowered': { type: 'shape10', color: '#7992B1' },
            'Motivated': { type: 'shape10', color: '#F0A8F6' },
            'Refreshed': { type: 'shape10', color: '#829E86' },
            'Invigorated': { type: 'shape10', color: '#CCBF84' },
            'Enlightened': { type: 'shape10', color: '#FEFFFE' },
            'Transformed': { type: 'shape10', color: '#D9AD99' },
            'Charged': { type: 'shape10', color: '#BBBEA0' }
        },
        
        // Electric, Magnetic, Quantum, Neural, Atomic -> High-tech shapes
        'Electric': {
            default: { type: 'shape11', color: '#FEA57D' },
            'Excited': { type: 'shape11', color: '#FEA57D' },
            'Inspired': { type: 'shape11', color: '#ABC9EF' },
            'Energized': { type: 'shape11', color: '#ECC889' },
            'Empowered': { type: 'shape11', color: '#7992B1' },
            'Motivated': { type: 'shape11', color: '#F0A8F6' },
            'Refreshed': { type: 'shape11', color: '#829E86' },
            'Invigorated': { type: 'shape11', color: '#CCBF84' },
            'Enlightened': { type: 'shape11', color: '#FEFFFE' },
            'Transformed': { type: 'shape11', color: '#D9AD99' },
            'Charged': { type: 'shape11', color: '#BBBEA0' }
        },
        'Magnetic': {
            default: { type: 'shape12', color: '#FEA57D' },
            'Excited': { type: 'shape12', color: '#FEA57D' },
            'Inspired': { type: 'shape12', color: '#ABC9EF' },
            'Energized': { type: 'shape12', color: '#ECC889' },
            'Empowered': { type: 'shape12', color: '#7992B1' },
            'Motivated': { type: 'shape12', color: '#F0A8F6' },
            'Refreshed': { type: 'shape12', color: '#829E86' },
            'Invigorated': { type: 'shape12', color: '#CCBF84' },
            'Enlightened': { type: 'shape12', color: '#FEFFFE' },
            'Transformed': { type: 'shape12', color: '#D9AD99' },
            'Charged': { type: 'shape12', color: '#BBBEA0' }
        },
        'Quantum': {
            default: { type: 'shape13', color: '#FEA57D' },
            'Excited': { type: 'shape13', color: '#FEA57D' },
            'Inspired': { type: 'shape13', color: '#ABC9EF' },
            'Energized': { type: 'shape13', color: '#ECC889' },
            'Empowered': { type: 'shape13', color: '#7992B1' },
            'Motivated': { type: 'shape13', color: '#F0A8F6' },
            'Refreshed': { type: 'shape13', color: '#829E86' },
            'Invigorated': { type: 'shape13', color: '#CCBF84' },
            'Enlightened': { type: 'shape13', color: '#FEFFFE' },
            'Transformed': { type: 'shape13', color: '#D9AD99' },
            'Charged': { type: 'shape13', color: '#BBBEA0' }
        },
        'Neural': {
            default: { type: 'shape14', color: '#FEA57D' },
            'Excited': { type: 'shape14', color: '#FEA57D' },
            'Inspired': { type: 'shape14', color: '#ABC9EF' },
            'Energized': { type: 'shape14', color: '#ECC889' },
            'Empowered': { type: 'shape14', color: '#7992B1' },
            'Motivated': { type: 'shape14', color: '#F0A8F6' },
            'Refreshed': { type: 'shape14', color: '#829E86' },
            'Invigorated': { type: 'shape14', color: '#CCBF84' },
            'Enlightened': { type: 'shape14', color: '#FEFFFE' },
            'Transformed': { type: 'shape14', color: '#D9AD99' },
            'Charged': { type: 'shape14', color: '#BBBEA0' }
        },
        'Atomic': {
            default: { type: 'shape15', color: '#FEA57D' },
            'Excited': { type: 'shape15', color: '#FEA57D' },
            'Inspired': { type: 'shape15', color: '#ABC9EF' },
            'Energized': { type: 'shape15', color: '#ECC889' },
            'Empowered': { type: 'shape15', color: '#7992B1' },
            'Motivated': { type: 'shape15', color: '#F0A8F6' },
            'Refreshed': { type: 'shape15', color: '#829E86' },
            'Invigorated': { type: 'shape15', color: '#CCBF84' },
            'Enlightened': { type: 'shape15', color: '#FEFFFE' },
            'Transformed': { type: 'shape15', color: '#D9AD99' },
            'Charged': { type: 'shape15', color: '#BBBEA0' }
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
        result = { type: 'shape1', color: '#FEA57D' };
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
 * Get a random flower shape and color
 * @returns {object} - Random shape object
 */
export function getRandomFruit() {
    const colors = ['#FEA57D', '#ABC9EF', '#ECC889', '#7992B1', '#F0A8F6', '#829E86', '#CCBF84', '#FEFFFE', '#D9AD99', '#BBBEA0'];
    const shapes = [];
    
    for (let i = 1; i <= 15; i++) {
        shapes.push({
            type: `shape${i}`,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
    
    return shapes[Math.floor(Math.random() * shapes.length)];
}

/**
 * Get all available flower shape types
 * @returns {array} - Array of all shape types
 */
export function getAllFruitTypes() {
    return [
        'shape1', 'shape2', 'shape3', 'shape4', 'shape5',
        'shape6', 'shape7', 'shape8', 'shape9', 'shape10',
        'shape11', 'shape12', 'shape13', 'shape14', 'shape15'
    ];
}

