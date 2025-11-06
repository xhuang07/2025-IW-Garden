# 🍅 Fresh Takes Garden

An innovative project showcase application for **Fresh Takes Innovation Week 2024**. Transform your team's projects into beautiful fruit stickers and plant them in a digital garden!

## 🌱 Features

- **🎨 Plant Projects**: Submit your innovations and generate unique fruit stickers
- **🌳 Interactive Garden**: View all projects in an animated garden with multiple layout options
  - Floating garden view
  - Orchard (tree) view
  - Grid view
  - Seasonal themes (Spring, Summer, Autumn, Winter)
- **🥬 Harvest Shelf**: Browse, search, and filter all projects in a gallery view
- **💡 Mad Libs Fruit Generator**: Select adjectives and feelings to determine your project's fruit type
- **❤️ Like System**: Show appreciation for innovative projects
- **📸 Screenshot Support**: Upload project images

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the repository**
```bash
cd fresh-takes-garden
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

### Running the Application

You'll need two terminal windows:

**Terminal 1 - Start the Backend Server:**
```bash
cd server
npm start
```
The server will run on `http://localhost:5000`

**Terminal 2 - Start the React Client:**
```bash
cd client
npm start
```
The client will run on `http://localhost:3000` and open automatically in your browser.

## 📁 Project Structure

```
fresh-takes-garden/
├── client/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Sticker.js    # Fruit sticker component
│   │   │   └── Fruit.js      # Animated fruit component
│   │   ├── pages/            # Page components
│   │   │   ├── Garden.js     # Main garden view
│   │   │   ├── Shelf.js      # Gallery/browse view
│   │   │   └── StickerGenerator.js  # Project submission
│   │   ├── styles/           # CSS files
│   │   ├── utils/            # Utility functions
│   │   │   └── fruitGenerator.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                    # Express backend
│   ├── server.js             # Main server file
│   ├── database.js           # SQLite database operations
│   └── package.json
│
├── database/                  # SQLite database storage
│   └── garden.db             # Auto-generated
│
└── uploads/                   # Project screenshots
    └── (auto-generated)
```

## 🎮 Usage

### Planting a Project

1. Navigate to **"Plant Project"** (🍎)
2. Fill in your project details:
   - Project name (required)
   - Location (required)
   - Your name (optional)
   - Project link (optional)
3. Use **Mad Libs** to select adjectives and feelings - this determines your fruit type!
4. Upload a screenshot (optional)
5. Click **"Preview Sticker"** to see your custom fruit sticker
6. Click **"Plant in Garden"** to submit

### Exploring the Garden

1. Navigate to **"Garden"** (🌱)
2. Switch between different views using the buttons:
   - 🎈 Floating Garden
   - 🌳 Orchard View
   - 📱 Grid View
3. Change seasons from the dropdown
4. Click on any fruit to see project details
5. Water projects with love (❤️ like button)

### Browsing the Shelf

1. Navigate to **"Harvest Shelf"** (🥬)
2. Use the search bar to find specific projects
3. Filter by fruit type
4. Sort by newest, oldest, most popular, or name
5. Click on any project card for more details

## 🍎 Fruit Types

The Mad Libs system generates different fruits based on your selections:

- **Revolutionary + Excited** = 🍓 Strawberry
- **Innovative + Inspired** = 🍑 Peach
- **Fresh + Refreshed** = 🥒 Cucumber
- **Electric + Energized** = 🍍 Pineapple
- And many more combinations!

## 🛠️ Tech Stack

**Frontend:**
- React 19
- React Router DOM
- Framer Motion (animations)
- Axios (HTTP client)

**Backend:**
- Node.js
- Express 5
- SQLite3
- Multer (file uploads)
- CORS

## 📊 Database Schema

The SQLite database stores projects with:
- `id`: Auto-incrementing primary key
- `projectName`: Project title
- `location`: Where the project is developed
- `creator`: Team member name
- `projectLink`: External URL
- `screenshot`: Image path
- `stickerData`: JSON data for the sticker
- `likes`: Like count
- `createdAt`: Timestamp
- `fruitType`: Type of fruit
- `positionX`, `positionY`: Garden coordinates
- `gardenRow`: Row in garden layout

## 🎨 Customization

### Adding New Fruit Types

Edit `/client/src/utils/fruitGenerator.js` to add new Mad Libs combinations and fruit mappings.

### Changing Themes

Modify the CSS files in `/client/src/styles/` to customize colors, animations, and layouts.

## 🐛 Troubleshooting

**Server won't start:**
- Make sure port 5000 is not in use
- Check that all dependencies are installed
- Ensure the `database` folder exists

**Client won't connect to server:**
- Verify the server is running on port 5000
- Check CORS settings in `server/server.js`
- Look for errors in browser console

**Database issues:**
- Delete `database/garden.db` to reset
- The database will be recreated with demo data on next server start

## 📝 API Endpoints

- `GET /api/health` - Health check
- `GET /api/projects` - Get all projects
- `GET /api/projects/search?q=query` - Search projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project (with file upload)
- `POST /api/projects/:id/like` - Like a project

## 🎉 Credits

Created for **Fresh Takes Innovation Week 2024** at ADDX

## 📄 License

This project is for internal use during Innovation Week.

---

**Happy Gardening! 🌱🍅🍎**

