# 🚀 Quick Start Guide

Get Fresh Takes Garden running in 5 minutes!

## Step 1: Install Dependencies

Open two terminals in the project root directory.

**Terminal 1 (Server):**
```bash
cd server
npm install
```

**Terminal 2 (Client):**
```bash
cd client
npm install
```

## Step 2: Start the Application

**Terminal 1 - Start Backend:**
```bash
cd server
npm start
```

You should see:
```
🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱

🍅 Fresh Takes Garden API 🍅

Server is growing on port 5000
Health check: http://localhost:5000/api/health

🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱
```

**Terminal 2 - Start Frontend:**
```bash
cd client
npm start
```

The app will automatically open in your browser at `http://localhost:3000`

## Step 3: Explore!

### 🌱 Garden Page
- View all projects as animated fruits
- Switch between floating, tree, and grid views
- Change seasons
- Click fruits to see details

### 🍎 Plant Project Page
- Submit your innovation
- Use Mad Libs to pick your fruit type
- Upload screenshots
- Generate custom stickers

### 🥬 Harvest Shelf Page
- Browse all projects in a gallery
- Search and filter
- Sort by various criteria

## 🎮 Try These Actions

1. **Plant Your First Project:**
   - Go to "Plant Project"
   - Enter: "My Awesome App" as name
   - Enter: "Innovation Lab" as location
   - Select: "Revolutionary" and "Excited" from Mad Libs
   - Click "Preview Sticker" to see your strawberry! 🍓
   - Click "Plant in Garden"

2. **Explore the Garden:**
   - Go to "Garden"
   - Try different view modes
   - Click on fruits to learn more
   - Like projects with the ❤️ button

3. **Search Projects:**
   - Go to "Harvest Shelf"
   - Search for "App"
   - Filter by fruit type
   - Sort by most popular

## 🔧 Troubleshooting

**Port already in use?**
- Kill the process using port 5000 or 3000
- Or change the port in the respective config files

**Can't connect to server?**
- Make sure the backend is running first
- Check that it's on port 5000
- Look for errors in the server terminal

**Missing dependencies?**
- Run `npm install` again in both directories
- Delete `node_modules` and reinstall if needed

## 📝 Demo Data

The app comes with 3 demo projects:
- 🍎 AI Assistant Bot
- 🍊 Customer Dashboard 2.0
- 🍇 Data Pipeline Optimizer

## 🎨 Customization Tips

- **Add new fruits:** Edit `client/src/utils/fruitGenerator.js`
- **Change colors:** Modify CSS files in `client/src/styles/`
- **Add new Mad Libs:** Update adjectives/feelings arrays in `StickerGenerator.js`

## 🆘 Need Help?

Check the full `README.md` for detailed documentation, API endpoints, and architecture details.

---

**Now go plant some innovations! 🌱**

