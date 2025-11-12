// client/src/utils/stickerGenerator.js
// Dynamic SVG sticker generator with fruit types and emotion shapes
// Updated to use pre-designed SVG files

// Project Type → Fruit File Mapping (15 types)
export const projectTypeToFruitFile = {
  'Fresh': 'apple',
  'Innovative': 'pear',
  'Disruptive': 'pineapple',
  'Bold': 'orange',
  'Crispy': 'strawberry',
  'Revolutionary': 'grape',
  'Experimental': 'kiwi',
  'Sustainable': 'avocado',
  'Creative': 'watermelon',
  'Juicy': 'lemon',
  'Organic': 'cherry',
  'Ripe': 'banana',
  'Electric': 'mango',
  'Magnetic': 'coconut',
  'Quantum': 'blueberry'
};

// Legacy mapping for backward compatibility
export const projectTypeToFruit = projectTypeToFruitFile;

// Project Emotion → Shape File Mapping (10 emotions)
export const emotionToShapeFile = {
  'Excited': 'excited',
  'Inspired': 'inspired',
  'Energized': 'energized',
  'Empowered': 'empowered',
  'Motivated': 'motivated',
  'Refreshed': 'refreshed',
  'Invigorated': 'invigorated',
  'Charged': 'charged',
  'Enlightened': 'enlightened',
  'Transformed': 'transformed'
};

// Legacy mapping for backward compatibility
export const emotionToShape = emotionToShapeFile;

// Shape background colors - specific palette for sticker backgrounds
const shapeBackgroundColors = [
  '#F4ADB3', // Soft pink - only for red fruits
  '#EAE7D6', // Cream beige
  '#F1D7FD', // Lavender purple
  '#CCE270', // Light lime green
  '#B4E4FF', // Sky blue
  '#FFE5B4', // Peach
  '#D4F1F4', // Mint cyan
  '#FED9ED', // Cotton candy pink
  '#E8F3D6', // Pale sage
  '#FFDAB9'  // Apricot
];

// Colors for backgrounds when fruit is NOT red (excludes #F4ADB3)
const shapeBackgroundColorsNonRed = [
  '#EAE7D6', // Cream beige
  '#F1D7FD', // Lavender purple
  '#CCE270', // Light lime green
  '#B4E4FF', // Sky blue
  '#FFE5B4', // Peach
  '#D4F1F4', // Mint cyan
  '#FED9ED', // Cotton candy pink
  '#E8F3D6', // Pale sage
  '#FFDAB9'  // Apricot
];

// Fruits that have red color (#F05847 or similar red tones)
const redFruits = ['strawberry', 'cherry', 'watermelon', 'apple'];

// Helper for pineapple diamond pattern
const generateDiamondPattern = (cx, cy, rx, ry) => {
  let pattern = '';
  for(let i = -2; i <= 2; i++) {
    for(let j = -3; j <= 3; j++) {
      const x = cx + (i * 15);
      const y = cy + (j * 18);
      pattern += `<path d="M ${x} ${y-5} L ${x+5} ${y} L ${x} ${y+5} L ${x-5} ${y} Z" fill="none" stroke="#8B6914" stroke-width="1" opacity="0.5"/>`;
    }
  }
  return pattern;
};

// Generate fruit SVG
export const generateFruitSVG = (fruitType, color) => {
  const fruits = {
    // Apple - circle with stem
    apple: `
      <g>
        <circle cx="150" cy="160" r="60" fill="${color}"/>
        <rect x="145" y="90" width="10" height="20" fill="#8B4513" rx="5"/>
        <ellipse cx="155" cy="95" rx="15" ry="8" fill="#228B22"/>
      </g>
    `,
    
    // Pear - teardrop shape
    'lightbulb-pear': `
      <g>
        <ellipse cx="150" cy="180" rx="55" ry="70" fill="${color}"/>
        <ellipse cx="150" cy="120" rx="30" ry="35" fill="${color}"/>
        <rect x="145" y="90" width="10" height="20" fill="#8B4513" rx="5"/>
      </g>
    `,
    
    // Pineapple - oval with diamond pattern
    pineapple: `
      <g>
        <ellipse cx="150" cy="160" rx="45" ry="65" fill="${color}"/>
        <path d="M 150 90 L 140 110 L 160 110 Z" fill="#228B22"/>
        <path d="M 145 95 L 135 115 L 155 115 Z" fill="#228B22"/>
        <path d="M 155 95 L 145 115 L 165 115 Z" fill="#228B22"/>
        ${generateDiamondPattern(150, 160, 45, 65)}
      </g>
    `,
    
    // Orange - circle with segments
    orange: `
      <g>
        <circle cx="150" cy="160" r="55" fill="${color}"/>
        <circle cx="150" cy="160" r="50" fill="none" stroke="#fff" stroke-width="2" opacity="0.3"/>
        ${Array.from({length: 8}, (_, i) => {
          const angle = (i * 45) * Math.PI / 180;
          const x2 = 150 + 50 * Math.cos(angle);
          const y2 = 160 + 50 * Math.sin(angle);
          return `<line x1="150" y1="160" x2="${x2}" y2="${y2}" stroke="#fff" stroke-width="2" opacity="0.3"/>`;
        }).join('')}
      </g>
    `,
    
    // Strawberry - heart-ish shape
    strawberry: `
      <g>
        <path d="M 150 200 C 120 170, 120 140, 150 120 C 180 140, 180 170, 150 200 Z" fill="${color}"/>
        ${Array.from({length: 20}, (_, i) => {
          const x = 125 + Math.random() * 50;
          const y = 130 + Math.random() * 60;
          return `<circle cx="${x}" cy="${y}" r="2" fill="#FFD700"/>`;
        }).join('')}
        <path d="M 130 115 L 150 105 L 170 115 L 165 125 L 135 125 Z" fill="#228B22"/>
      </g>
    `,
    
    // Grape cluster - multiple circles
    'grape-cluster': `
      <g>
        ${[
          [150, 140], [140, 155], [160, 155],
          [135, 170], [150, 170], [165, 170],
          [145, 185], [155, 185]
        ].map(([x, y]) => 
          `<circle cx="${x}" cy="${y}" r="12" fill="${color}" stroke="#4B0082" stroke-width="1"/>`
        ).join('')}
        <rect x="145" y="110" width="10" height="25" fill="#8B4513" rx="3"/>
      </g>
    `,
    
    // Kiwi - oval with seeds
    kiwi: `
      <g>
        <ellipse cx="150" cy="160" rx="50" ry="55" fill="${color}"/>
        <ellipse cx="150" cy="160" rx="35" ry="40" fill="#90EE90" opacity="0.7"/>
        ${Array.from({length: 30}, (_, i) => {
          const angle = (i * 12) * Math.PI / 180;
          const dist = 20 + Math.random() * 15;
          const x = 150 + dist * Math.cos(angle);
          const y = 160 + dist * Math.sin(angle);
          return `<line x1="150" y1="160" x2="${x}" y2="${y}" stroke="#000" stroke-width="1" opacity="0.3"/>`;
        }).join('')}
      </g>
    `,
    
    // Avocado - pear shape with pit
    avocado: `
      <g>
        <ellipse cx="150" cy="170" rx="50" ry="65" fill="${color}"/>
        <ellipse cx="150" cy="165" rx="40" ry="50" fill="#9ACD32"/>
        <circle cx="150" cy="165" r="20" fill="#8B4513"/>
      </g>
    `,
    
    // Watermelon slice - semicircle
    'watermelon-slice': `
      <g>
        <path d="M 100 180 A 50 50 0 0 1 200 180 Z" fill="${color}"/>
        <path d="M 105 180 A 45 45 0 0 1 195 180 Z" fill="#FFB6C1"/>
        <path d="M 110 180 A 40 40 0 0 1 190 180" fill="none" stroke="#90EE90" stroke-width="8"/>
        ${Array.from({length: 8}, (_, i) => {
          const x = 120 + i * 10;
          const y = 140 + Math.random() * 30;
          return `<ellipse cx="${x}" cy="${y}" rx="3" ry="4" fill="#000"/>`;
        }).join('')}
      </g>
    `,
    
    // Lemon - oval shape
    lemon: `
      <g>
        <ellipse cx="150" cy="160" rx="40" ry="60" fill="${color}"/>
        <ellipse cx="150" cy="110" rx="10" ry="15" fill="${color}"/>
        <ellipse cx="150" cy="210" rx="10" ry="15" fill="${color}"/>
      </g>
    `,
    
    // Cherry pair - two circles with stems
    'cherry-pair': `
      <g>
        <circle cx="135" cy="170" r="25" fill="${color}"/>
        <circle cx="165" cy="170" r="25" fill="${color}"/>
        <path d="M 135 145 Q 150 110 150 100" stroke="#8B4513" stroke-width="3" fill="none"/>
        <path d="M 165 145 Q 150 110 150 100" stroke="#8B4513" stroke-width="3" fill="none"/>
        <circle cx="135" cy="170" r="3" fill="#fff" opacity="0.6"/>
        <circle cx="165" cy="170" r="3" fill="#fff" opacity="0.6"/>
      </g>
    `,
    
    // Banana - curved shape
    banana: `
      <g>
        <path d="M 120 140 Q 150 130 180 145 Q 185 160 180 175 Q 150 185 120 175 Q 115 160 120 140 Z" fill="${color}"/>
        <path d="M 125 145 Q 150 138 175 150" stroke="#000" stroke-width="1" opacity="0.2" fill="none"/>
        <path d="M 125 160 Q 150 153 175 165" stroke="#000" stroke-width="1" opacity="0.2" fill="none"/>
      </g>
    `,
    
    // Mango - oval with stem
    mango: `
      <g>
        <ellipse cx="150" cy="165" rx="50" ry="60" fill="${color}"/>
        <rect x="145" y="100" width="10" height="15" fill="#8B4513" rx="5"/>
        <ellipse cx="155" cy="105" rx="12" ry="6" fill="#228B22"/>
      </g>
    `,
    
    // Coconut - circle with texture
    coconut: `
      <g>
        <circle cx="150" cy="160" r="55" fill="${color}"/>
        ${Array.from({length: 15}, (_, i) => {
          const angle = (i * 24) * Math.PI / 180;
          const x1 = 150 + 35 * Math.cos(angle);
          const y1 = 160 + 35 * Math.sin(angle);
          const x2 = 150 + 55 * Math.cos(angle);
          const y2 = 160 + 55 * Math.sin(angle);
          return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#8B4513" stroke-width="2"/>`;
        }).join('')}
        <circle cx="140" cy="145" r="8" fill="#654321"/>
        <circle cx="160" cy="145" r="8" fill="#654321"/>
        <path d="M 140 170 Q 150 175 160 170" stroke="#654321" stroke-width="3" fill="none"/>
      </g>
    `,
    
    // Blueberry - small circle cluster
    blueberry: `
      <g>
        ${[
          [150, 150, 22], [135, 165, 20], [165, 165, 20],
          [150, 180, 18]
        ].map(([x, y, r]) => `
          <circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>
          <circle cx="${x}" cy="${y-r/3}" r="${r/4}" fill="#fff" opacity="0.3"/>
        `).join('')}
        <ellipse cx="150" cy="142" rx="6" ry="3" fill="#654321"/>
      </g>
    `
  };
  
  return fruits[fruitType] || fruits.apple;
};

// Generate sticker shape paths
export const generateStickerShape = (emotion) => {
  const shapes = {
    // Excited - Starburst (8 points)
    starburst: `
      M 150,20 
      L 165,80 L 220,70 L 180,110 L 210,160 
      L 155,145 L 150,200 L 145,145 L 90,160 
      L 120,110 L 80,70 L 135,80 Z
    `,
    
    // Inspired - Cloud shape
    cloud: `
      M 80,140 
      Q 80,100 120,100 
      Q 130,70 160,70 
      Q 190,70 200,100 
      Q 240,100 240,140 
      Q 240,180 200,180 
      Q 190,210 160,210 
      Q 130,210 120,180 
      Q 80,180 80,140 Z
    `,
    
    // Energized - Lightning bolt
    lightning: `
      M 180,40 L 140,120 L 170,120 
      L 130,210 L 190,140 L 160,140 
      L 200,60 Z
    `,
    
    // Empowered - Shield
    shield: `
      M 150,30 
      L 220,70 L 220,140 
      Q 220,200 150,230 
      Q 80,200 80,140 
      L 80,70 Z
    `,
    
    // Motivated - Upward arrow
    arrow: `
      M 150,30 L 200,90 L 175,90 
      L 175,210 L 125,210 L 125,90 
      L 100,90 Z
    `,
    
    // Refreshed - Wave
    wave: `
      M 70,120 
      Q 100,80 130,120 
      Q 160,160 190,120 
      Q 220,80 250,120 
      L 250,200 Q 220,180 190,200 
      Q 160,220 130,200 
      Q 100,180 70,200 Z
    `,
    
    // Invigorated - Circular burst
    burst: `
      M 150,40 L 165,100 L 210,80 
      L 180,125 L 220,160 L 165,155 
      L 170,210 L 150,165 L 130,210 
      L 135,155 L 80,160 L 120,125 
      L 90,80 L 135,100 Z
    `,
    
    // Charged - Hexagon
    hexagon: `
      M 150,50 L 210,95 L 210,165 
      L 150,210 L 90,165 L 90,95 Z
    `,
    
    // Enlightened - Sun with rays
    sun: `
      M 150,60 L 155,90 L 165,65 L 165,95 
      L 180,75 L 175,100 L 195,85 L 185,110 
      L 205,105 L 190,125 L 210,130 L 190,140 
      L 205,155 L 185,150 L 195,175 L 175,160 
      L 180,185 L 165,165 L 165,195 L 155,170 
      L 150,200 L 145,170 L 135,195 L 135,165 
      L 120,185 L 125,160 L 105,175 L 115,150 
      L 95,155 L 110,140 L 90,130 L 110,125 
      L 95,105 L 115,110 L 105,85 L 125,100 
      L 120,75 L 135,95 L 135,65 L 145,90 Z
    `,
    
    // Transformed - Butterfly
    butterfly: `
      M 150,80 
      Q 130,70 110,90 Q 90,110 100,140 
      Q 110,170 130,160 L 140,150 
      L 140,200 L 145,210 L 150,215 
      L 155,210 L 160,200 L 160,150 
      L 170,160 Q 190,170 200,140 
      Q 210,110 190,90 Q 170,70 150,80 
      M 150,60 L 155,75 L 150,80 L 145,75 Z
    `
  };
  
  return shapes[emotion.toLowerCase()] || shapes.burst;
};

// Get random shape background color from palette
const getRandomShapeColor = (fruitType) => {
  // Check if fruit has red color
  const isRedFruit = fruitType && redFruits.includes(fruitType.toLowerCase());
  
  // If red fruit, can use any color including #F4ADB3
  // If not red fruit, exclude #F4ADB3 from palette
  const palette = isRedFruit ? shapeBackgroundColors : shapeBackgroundColorsNonRed;
  
  return palette[Math.floor(Math.random() * palette.length)];
};

// Generate sticker colors (only background, fruits keep original colors)
export const generateStickerColors = (fruitType) => {
  return {
    backgroundColor: getRandomShapeColor(fruitType)
    // No fruitColor - fruits use their original SVG colors
  };
};

// Legacy function for backward compatibility
export const generateColorPair = () => {
  return {
    fruitColor: '#FF6B6B', // Dummy value for compatibility
    backgroundColor: getRandomShapeColor()
  };
};

// ========================================
// SVG FILE LOADING AND PROCESSING
// ========================================

/**
 * Load SVG file from public directory
 * @param {string} filepath - Path to SVG file relative to public folder
 * @returns {Promise<string|null>} SVG content as string or null if failed
 */
export const loadSVG = async (filepath) => {
  try {
    const response = await fetch(filepath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const svgText = await response.text();
    return svgText;
  } catch (error) {
    console.error(`Failed to load SVG: ${filepath}`, error);
    return null;
  }
};

/**
 * Apply background color to shape SVG elements only
 * DO NOT use this function on fruit SVGs - they keep original colors
 * @param {string} svgString - Shape SVG content as string
 * @param {string} backgroundColor - Background color to apply
 * @returns {string} Colored shape SVG string
 */
export const applySVGColor = (svgString, backgroundColor) => {
  if (!svgString) return '';
  
  try {
    // Parse SVG
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');
    
    // Apply background color to shape elements only
    const shapeElements = doc.querySelectorAll('path, circle, rect, polygon, ellipse');
    shapeElements.forEach(element => {
      // Apply background color
      element.setAttribute('fill', backgroundColor);
      // Keep or add stroke styling
      if (!element.getAttribute('stroke')) {
        element.setAttribute('stroke', '#333');
        element.setAttribute('stroke-width', '2');
      }
    });
    
    const serializer = new XMLSerializer();
    return serializer.serializeToString(doc);
  } catch (error) {
    console.error('Error applying SVG color:', error);
    return svgString;
  }
};

/**
 * Insert fruit SVG into shape SVG
 * Fruit colors remain UNCHANGED - only shape background is colored
 * @param {string} shapeSVG - Background shape SVG
 * @param {string} fruitSVG - Fruit SVG to insert (keeps original colors)
 * @param {string} backgroundColor - Background color for shape
 * @param {boolean} animated - Whether to include animations (default: true)
 * @returns {string} Composite SVG string
 */
export const insertSVGIntoShape = (shapeSVG, fruitSVG, backgroundColor, animated = true) => {
  if (!shapeSVG || !fruitSVG) return '';
  
  try {
    const parser = new DOMParser();
    const shapeDoc = parser.parseFromString(shapeSVG, 'image/svg+xml');
    const fruitDoc = parser.parseFromString(fruitSVG, 'image/svg+xml');
    
    // Check for parsing errors
    const shapeError = shapeDoc.querySelector('parsererror');
    const fruitError = fruitDoc.querySelector('parsererror');
    if (shapeError || fruitError) {
      console.error('SVG parsing error');
      return '';
    }
    
    // Apply background color to shape ONLY (no stroke)
    const shapePaths = shapeDoc.querySelectorAll('path, circle, rect, polygon, ellipse');
    shapePaths.forEach(element => {
      element.setAttribute('fill', backgroundColor);
      // Remove any existing stroke
      element.removeAttribute('stroke');
      element.removeAttribute('stroke-width');
    });
    
    // Get fruit elements - DO NOT modify colors, use as-is
    const fruitSvgElement = fruitDoc.querySelector('svg');
    if (!fruitSvgElement) return '';
    
    const fruitElements = fruitSvgElement.innerHTML;
    
    // Get fruit's viewBox to calculate its center
    const fruitViewBox = fruitSvgElement.getAttribute('viewBox');
    let fruitCenterX = 50, fruitCenterY = 50; // defaults
    
    if (fruitViewBox) {
      const [fx, fy, fwidth, fheight] = fruitViewBox.split(' ').map(Number);
      fruitCenterX = fx + fwidth / 2;
      fruitCenterY = fy + fheight / 2;
    }
    
    // Insert fruit into shape SVG
    const shapeSvgElement = shapeDoc.querySelector('svg');
    if (!shapeSvgElement) return '';
    
    // Get shape's viewBox to calculate center position
    const viewBox = shapeSvgElement.getAttribute('viewBox');
    let centerX = 150, centerY = 125; // defaults
    
    if (viewBox) {
      const [x, y, width, height] = viewBox.split(' ').map(Number);
      centerX = x + width / 2;
      centerY = y + height / 2;
    }
    
    // Wrap all shape elements in a group with rotation animation
    const shapeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const shapeElements = Array.from(shapeSvgElement.children);
    shapeElements.forEach(element => {
      shapeGroup.appendChild(element);
    });
    
    // Scale down the shape to 85% and center it (adjust 0.85 to make it smaller/larger)
    const shapeScale = 0.85;
    shapeGroup.setAttribute('transform', `translate(${centerX}, ${centerY}) scale(${shapeScale}) translate(-${centerX}, -${centerY})`);
    
    // Add clockwise rotation animation to shape group (12 seconds) - only if animated
    if (animated) {
      const rotateAnim = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
      rotateAnim.setAttribute('attributeName', 'transform');
      rotateAnim.setAttribute('attributeType', 'XML');
      rotateAnim.setAttribute('type', 'rotate');
      rotateAnim.setAttribute('from', `0 ${centerX} ${centerY}`);
      rotateAnim.setAttribute('to', `360 ${centerX} ${centerY}`);
      rotateAnim.setAttribute('dur', '5s');
      rotateAnim.setAttribute('repeatCount', 'indefinite');
      rotateAnim.setAttribute('additive', 'sum'); // Add rotation to the static transform
      shapeGroup.appendChild(rotateAnim);
    }
    
    shapeSvgElement.appendChild(shapeGroup);
    
    // Create fruit group with positioning
    const fruitGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    fruitGroup.innerHTML = fruitElements;
    fruitGroup.setAttribute('class', 'sticker-fruit-group');
    
    // Center and scale the fruit to occupy 70% of the shape (static positioning)
    fruitGroup.setAttribute('transform', `translate(${centerX}, ${centerY}) scale(0.7) translate(-${fruitCenterX}, -${fruitCenterY})`);
    
    // Add gentle bounce animation to fruit (2 seconds, up and down) - only if animated
    if (animated) {
      // Increase amplitude to 100px to account for large viewBox scaling
      const bounceAnim = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
      bounceAnim.setAttribute('attributeName', 'transform');
      bounceAnim.setAttribute('attributeType', 'XML');
      bounceAnim.setAttribute('type', 'translate');
      bounceAnim.setAttribute('values', '0,0; 0,-150; 0,0'); // Bounce up 100px and back
      bounceAnim.setAttribute('dur', '1.5s');
      bounceAnim.setAttribute('repeatCount', 'indefinite');
      bounceAnim.setAttribute('additive', 'sum'); // Add to existing transform
      bounceAnim.setAttribute('calcMode', 'spline');
      bounceAnim.setAttribute('keySplines', '0.42 0 0.58 1; 0.42 0 0.58 1');
      bounceAnim.setAttribute('keyTimes', '0; 0.5; 1');
      fruitGroup.appendChild(bounceAnim);
    }
    
    shapeSvgElement.appendChild(fruitGroup);
    
    // Serialize back to string
    const serializer = new XMLSerializer();
    return serializer.serializeToString(shapeDoc);
  } catch (error) {
    console.error('Error inserting SVG:', error);
    return '';
  }
};

// Format location text
export const formatLocationText = (location) => {
  if (!location) return 'GARDEN';
  
  // City abbreviations map
  const cityAbbreviations = {
    'San Francisco': 'SF',
    'San Jose': 'SJ',
    'Los Angeles': 'LA',
    'New York': 'NY',
    'San Diego': 'SD',
    'Santa Clara': 'SC',
    'Mountain View': 'MV',
    'Palo Alto': 'PA',
    'Redwood City': 'RWC',
    'San Mateo': 'SM',
    'Santa Monica': 'SM',
    'Santa Cruz': 'SC',
    'San Antonio': 'SA',
    'Washington DC': 'DC',
    'Fort Worth': 'FW',
    'Colorado Springs': 'CS',
    'Kansas City': 'KC',
    'New Orleans': 'NO'
  };
  
  // Check if location has a known abbreviation
  if (cityAbbreviations[location]) {
    return cityAbbreviations[location];
  }
  
  // If longer than 10 characters, create abbreviation
  if (location.length > 10) {
    // Try to abbreviate: take first letters of words
    const words = location.split(' ');
    if (words.length > 1) {
      return words.map(w => w[0].toUpperCase()).join('');
    }
    // If single long word, truncate
    return location.substring(0, 8).toUpperCase() + '..';
  }
  
  return location.toUpperCase();
};

// Split text into two lines if needed
export const splitLocationText = (text) => {
  if (text.length <= 8) {
    return [text, ''];
  }
  
  const words = text.split(' ');
  if (words.length === 1) {
    return [text, ''];
  }
  
  const mid = Math.ceil(words.length / 2);
  return [
    words.slice(0, mid).join(' '),
    words.slice(mid).join(' ')
  ];
};

// ========================================
// ASYNC STICKER GENERATION FROM SVG FILES
// ========================================

/**
 * Generate sticker from pre-designed SVG files (RECOMMENDED)
 * @param {string} adjective - Project adjective
 * @param {string} feeling - Project emotion/feeling
 * @param {string} location - Project location
 * @returns {Promise<string|null>} Generated SVG string or null if failed
 */
export const generateStickerFromFiles = async (adjective, feeling, location, animated = true) => {
  try {
    // Get file names
    const fruitFileName = projectTypeToFruitFile[adjective] || 'apple';
    const shapeFileName = emotionToShapeFile[feeling] || 'excited';
    
    console.log(`🎨 Loading SVG files: fruit=${fruitFileName}, shape=${shapeFileName}`);
    
    // Load SVG files
    const [fruitSVG, shapeSVG] = await Promise.all([
      loadSVG(`/sticker-assets/fruits/${fruitFileName}.svg`),
      loadSVG(`/sticker-assets/shapes/${shapeFileName}.svg`)
    ]);
    
    if (!fruitSVG || !shapeSVG) {
      console.warn('❌ Failed to load SVG files, falling back to programmatic generation');
      return null;
    }
    
    console.log('✅ SVG files loaded successfully');
    
    // Generate background color only (fruits keep original colors)
    // Pass fruit type to ensure proper color contrast
    const { backgroundColor } = generateStickerColors(fruitFileName);
    
    // DO NOT apply color to fruit - use original colors
    // Combine shape and fruit (fruit keeps original colors)
    let compositeSVG = insertSVGIntoShape(shapeSVG, fruitSVG, backgroundColor, animated);
    
    if (!compositeSVG) {
      console.warn('❌ Failed to compose SVG, falling back to programmatic generation');
      return null;
    }
    
    // Format location text
    // const locationText = formatLocationText(location);
    // const [line1, line2] = splitLocationText(locationText);
    
    // Add location text to SVG - COMMENTED OUT TO REMOVE TEXT FROM STICKER
    const parser = new DOMParser();
    const doc = parser.parseFromString(compositeSVG, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    
    if (!svg) {
      console.warn('❌ Failed to parse composite SVG');
      return null;
    }
    
    // Get the existing viewBox or use default
    const viewBox = svg.getAttribute('viewBox');
    let vbWidth = 300, vbHeight = 250, vbX = 0, vbY = 0;
    
    if (viewBox) {
      const [x, y, width, height] = viewBox.split(' ').map(Number);
      vbX = x;
      vbY = y;
      vbWidth = width;
      vbHeight = height;
    } else {
      // Set default viewBox if none exists
      svg.setAttribute('viewBox', '0 0 300 250');
    }
    
    // Set display dimensions (how it appears in browser)
    svg.setAttribute('width', '300');
    svg.setAttribute('height', '250');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    
    // Calculate text position based on viewBox (bottom center)
    // const textX = vbX + vbWidth / 2;
    // const textY1 = vbY + vbHeight - (line2 ? 40 : 30);
    // const textY2 = vbY + vbHeight - 20;
    
    // Calculate font size relative to viewBox
    // const fontSize1 = line2 ? vbHeight * 0.06 : vbHeight * 0.08;
    // const fontSize2 = vbHeight * 0.05;
    
    // Add text element(s) - COMMENTED OUT
    // const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // const text1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    // text1.setAttribute('x', textX.toString());
    // text1.setAttribute('y', textY1.toString());
    // text1.setAttribute('text-anchor', 'middle');
    // text1.setAttribute('font-family', 'Arial, sans-serif');
    // text1.setAttribute('font-size', fontSize1.toString());
    // text1.setAttribute('font-weight', 'bold');
    // text1.setAttribute('fill', '#333');
    // text1.textContent = line1;
    // textGroup.appendChild(text1);
    
    // if (line2) {
    //   const text2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    //   text2.setAttribute('x', textX.toString());
    //   text2.setAttribute('y', textY2.toString());
    //   text2.setAttribute('text-anchor', 'middle');
    //   text2.setAttribute('font-family', 'Arial, sans-serif');
    //   text2.setAttribute('font-size', fontSize2.toString());
    //   text2.setAttribute('font-weight', 'bold');
    //   text2.setAttribute('fill', '#333');
    //   text2.textContent = line2;
    //   textGroup.appendChild(text2);
    // }
    
    // svg.appendChild(textGroup);
    
    // Serialize final SVG
    const serializer = new XMLSerializer();
    const finalSVG = serializer.serializeToString(doc);
    
    console.log('✅ Sticker generated successfully from SVG files');
    return finalSVG;
  } catch (error) {
    console.error('❌ Error generating sticker from files:', error);
    return null;
  }
};

// ========================================
// FALLBACK: PROGRAMMATIC STICKER GENERATION
// ========================================

/**
 * Generate sticker programmatically (FALLBACK)
 * Used when SVG files are not available
 * @param {string} adjective - Project adjective
 * @param {string} feeling - Project emotion/feeling
 * @param {string} location - Project location
 * @returns {string} Generated SVG string
 */
export const generateStickerSVG = (adjective, feeling, location) => {
  console.log('🎨 Using programmatic sticker generation (fallback)');
  
  // Map adjective to fruit type
  const fruitType = projectTypeToFruit[adjective] || 'apple';
  
  // Map feeling to shape
  const shapeEmotion = emotionToShape[feeling] || 'burst';
  
  // Generate background color (programmatic fruits will still use dynamic colors in fallback)
  // Pass fruit type to ensure proper color contrast
  const { backgroundColor } = generateStickerColors(fruitType);
  
  // For programmatic generation, we still need a fruit color
  const fruitColor = '#FF8E53'; // Default color for fallback
  
  // Format location - COMMENTED OUT TO REMOVE TEXT FROM STICKER
  // const locationText = formatLocationText(location);
  // const [line1, line2] = splitLocationText(locationText);
  
  // Generate sticker shape path
  const shapePath = generateStickerShape(feeling);
  
  // Generate fruit SVG
  const fruitSVG = generateFruitSVG(fruitType, fruitColor);
  
  // Compose final SVG
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 250" width="300" height="250">
      <!-- Background shape -->
      <path d="${shapePath}" fill="${backgroundColor}" stroke="#333" stroke-width="3"/>
      
      <!-- Fruit -->
      ${fruitSVG}
      
      <!-- Location text removed -->
    </svg>
  `;
  
  return svg;
};

// Export for use in database
export const getStickerMetadata = (adjective, feeling) => {
  const fruitType = projectTypeToFruit[adjective] || 'apple';
  const shapeEmotion = emotionToShape[feeling] || 'burst';
  // Pass fruit type to ensure proper color contrast
  const { backgroundColor } = generateStickerColors(fruitType);
  
  return {
    fruitType,
    shapeEmotion,
    fruitColor: 'original', // Fruits use their original SVG colors
    backgroundColor
  };
};

