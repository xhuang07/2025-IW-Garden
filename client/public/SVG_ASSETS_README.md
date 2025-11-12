# Sticker Assets - SVG Files Directory

## 📁 Required Folder Structure

Create the following structure in the `/public` directory:

```
/public
  /sticker-assets
    /fruits          (15 SVG files)
      - apple.svg
      - pear.svg
      - pineapple.svg
      - orange.svg
      - strawberry.svg
      - grape.svg
      - kiwi.svg
      - avocado.svg
      - watermelon.svg
      - lemon.svg
      - cherry.svg
      - banana.svg
      - mango.svg
      - coconut.svg
      - blueberry.svg
      
    /shapes          (10 SVG files)
      - excited.svg
      - inspired.svg
      - energized.svg
      - empowered.svg
      - motivated.svg
      - refreshed.svg
      - invigorated.svg
      - charged.svg
      - enlightened.svg
      - transformed.svg
```

## 🎨 SVG File Requirements

### General Requirements
- **Format**: Clean, optimized SVG files
- **ViewBox**: Recommended `0 0 300 250` or similar dimensions
- **File Size**: Keep under 50KB per file for optimal performance
- **Naming**: MUST match the exact names listed above (case-sensitive)

### Fruit SVG Guidelines
- Should be centered within the viewBox
- Remove hardcoded colors if you want dynamic coloring
- Use simple, recognizable shapes
- Avoid complex gradients (they may not color well)
- Test with different colors to ensure visibility

### Shape SVG Guidelines
- Should be outline/border shapes (starburst, cloud, etc.)
- Leave the center area empty for fruit placement
- Use simple fills that can accept color changes
- Stroke width: 2-3px recommended
- Test that fruits fit nicely inside

## 🔧 How Dynamic Coloring Works

The sticker generator applies colors to your SVGs automatically:

1. **Fruit Colors**: Random vibrant colors (#FF6B6B, #4ECDC4, etc.)
2. **Shape/Background**: Random pastel colors (#FFE5E5, #E0F7FA, etc.)

The system replaces `fill` attributes in your SVG with these colors.

### To Preserve Specific Colors
If you want certain elements to keep their original color (like highlights or details):
- Use `fill="white"` or `fill="#fff"` for white elements
- Use `fill="black"` or `fill="#000"` for black elements
- These colors are preserved during the coloring process

## 📝 Mapping Reference

### Adjective → Fruit
| Adjective | Fruit File |
|-----------|------------|
| Fresh | apple.svg |
| Innovative | pear.svg |
| Disruptive | pineapple.svg |
| Bold | orange.svg |
| Crispy | strawberry.svg |
| Revolutionary | grape.svg |
| Experimental | kiwi.svg |
| Sustainable | avocado.svg |
| Creative | watermelon.svg |
| Juicy | lemon.svg |
| Organic | cherry.svg |
| Ripe | banana.svg |
| Electric | mango.svg |
| Magnetic | coconut.svg |
| Quantum | blueberry.svg |

### Emotion → Shape
| Emotion | Shape File |
|---------|------------|
| Excited | excited.svg (starburst) |
| Inspired | inspired.svg (cloud) |
| Energized | energized.svg (lightning) |
| Empowered | empowered.svg (shield) |
| Motivated | motivated.svg (arrow) |
| Refreshed | refreshed.svg (wave) |
| Invigorated | invigorated.svg (burst) |
| Charged | charged.svg (hexagon) |
| Enlightened | enlightened.svg (sun) |
| Transformed | transformed.svg (butterfly) |

## 🚀 Adding SVG Files

1. **Create the folder structure** in `/public/sticker-assets/`
2. **Name your SVG files exactly as shown** above
3. **Drag and drop** the entire `sticker-assets` folder into Cursor
4. **Test the generator** by clicking "Preview Sticker" button
5. **Check console logs** for any loading errors

## 🔍 Testing

After adding files, test by:
1. Go to "Plant Project" page
2. Fill in form with project details
3. Select different adjectives and emotions
4. Click "Preview Sticker"
5. Check browser console for messages:
   - ✅ "SVG files loaded successfully" = Working!
   - ❌ "Failed to load SVG files" = Check file paths/names

## ⚠️ Fallback Behavior

If SVG files are not found or fail to load:
- **The app will still work!**
- It automatically falls back to programmatic generation
- Console will show: "⚠️ Falling back to programmatic generation"
- You'll see geometric shapes instead of your custom SVGs

This ensures the app never breaks even if files are missing.

## 🎯 Example SVG Structure

### Fruit Example (apple.svg)
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 250">
  <!-- Main apple shape - will be colored -->
  <circle cx="150" cy="150" r="60" fill="#FF0000"/>
  
  <!-- Stem - will be colored brown -->
  <rect x="145" y="80" width="10" height="20" fill="#8B4513" rx="5"/>
  
  <!-- Leaf - keep green by using white/black preservation if needed -->
  <ellipse cx="155" cy="85" rx="15" ry="8" fill="#228B22"/>
  
  <!-- Highlight - preserved as white -->
  <circle cx="130" cy="130" r="10" fill="white" opacity="0.6"/>
</svg>
```

### Shape Example (excited.svg)
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 250">
  <!-- Starburst outline - will be colored pastel -->
  <path d="M 150,20 L 165,80 L 220,70 L 180,110 L 210,160 
           L 155,145 L 150,200 L 145,145 L 90,160 L 120,110 
           L 80,70 L 135,80 Z" 
        fill="#FFE5E5" 
        stroke="#333" 
        stroke-width="2"/>
</svg>
```

## 📊 Status Indicators

Watch the browser console for these messages:

| Message | Meaning |
|---------|---------|
| 🎨 Loading SVG files: fruit=apple, shape=excited | Starting to load files |
| ✅ SVG files loaded successfully | Files found and loaded |
| ✅ Sticker generated successfully from SVG files | Complete success! |
| ❌ Failed to load SVG files | Files not found or invalid |
| ⚠️ Falling back to programmatic generation | Using backup method |

## 🐛 Troubleshooting

### Files Not Loading?
1. Check file names match exactly (case-sensitive)
2. Verify folder structure: `/public/sticker-assets/fruits/` and `/shapes/`
3. Open browser DevTools → Network tab to see 404 errors
4. Ensure SVG files are valid XML

### Colors Not Applying?
1. Remove inline styles from SVG
2. Use `fill` attributes instead of CSS
3. Check that elements don't have `fill="none"`

### Fruits Not Centered?
1. Adjust transform in `insertSVGIntoShape()` function
2. Current: `translate(150, 125) scale(0.6)`
3. Modify to fit your specific SVG dimensions

## 📚 Resources

- **SVG Optimization**: Use [SVGOMG](https://jakearchibald.github.io/svgomg/) to optimize files
- **SVG Icons**: Check [Heroicons](https://heroicons.com/), [Feather](https://feathericons.com/)
- **Custom SVG**: Create in Figma, Adobe Illustrator, or [Inkscape](https://inkscape.org/)

---

**Once you add the SVG files, the sticker generator will automatically use them instead of programmatic shapes!** 🎉

