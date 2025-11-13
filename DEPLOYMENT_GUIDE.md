# Deployment Guide for Fresh Takes Garden

## Problem Solved
The deployment was failing because the project has a monorepo structure with separate `client/` and `server/` directories, but deployment platforms expected a root `package.json` file.

## Changes Made

### 1. Root `package.json` Created
Created `/package.json` at the project root with scripts to:
- Install dependencies for both client and server (`postinstall` hook)
- Build the React client app
- Start the production server with `NODE_ENV=production`

### 2. Server Configuration Updated
Modified `/server/server.js` to:
- Serve the React build folder as static files in production
- Add a catch-all route to serve `index.html` for client-side routing
- Handle both API requests and frontend serving from a single server

### 3. API Configuration
Created `/client/src/config.js` to:
- Use relative URLs in production (same origin)
- Use `localhost:5000` only in development
- Ensure seamless transition between environments

### 4. Updated All API Calls
Updated all fetch calls in the following files to use the dynamic `API_BASE_URL`:
- `client/src/App.js`
- `client/src/pages/Garden.js`
- `client/src/pages/StickerGenerator.js`
- `client/src/pages/Shelf.js`

## How Deployment Works Now

### Build Process
```bash
npm install          # Installs root deps + runs postinstall
                     # → installs client & server deps
npm run build        # Builds React app to client/build/
npm start            # Starts server with NODE_ENV=production
                     # → Serves API + React app
```

### Production Architecture
```
Server (Express on PORT)
├── /api/*           → API routes (database, uploads, etc.)
├── /uploads/*       → Static uploaded files
└── /*               → React app (client/build/)
```

## Deployment Platform Configuration

### Required Environment Variables
- `PORT` - Set by platform (default: 5000)
- `NODE_ENV` - Should be set to `production`

### Build Commands
Most platforms will auto-detect the scripts, but if needed:
- **Install Command**: `npm install`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

### File System Requirements
The server needs write access to:
- `/database/garden.db` - SQLite database
- `/uploads/` - User uploaded screenshots

**Note**: Some platforms use ephemeral file systems. You may need to:
1. Use a persistent volume for uploads
2. Use a cloud storage service (S3, Cloudinary, etc.)
3. Use a managed database service instead of SQLite

## Testing Locally

### Development Mode (Client & Server Separate)
```bash
# Terminal 1 - Server
cd server
npm start

# Terminal 2 - Client  
cd client
npm start
```

### Production Mode (Simulated)
```bash
# From project root
npm install
npm run build
NODE_ENV=production npm start
```
Then visit `http://localhost:5000`

## Common Deployment Issues

### Issue: "Cannot find module" errors
**Solution**: Make sure `postinstall` script runs. Try `npm install --production=false`

### Issue: API calls return 404
**Solution**: Ensure `NODE_ENV=production` is set so the server serves static files

### Issue: Database/uploads not persisting
**Solution**: Configure persistent storage volumes on your deployment platform

### Issue: Build fails with memory errors
**Solution**: Increase Node memory limit: `NODE_OPTIONS=--max-old-space-size=4096`

## Deployment Platform Examples

### Render
1. Create new Web Service
2. Connect your GitHub repo
3. Set Build Command: `npm run build`
4. Set Start Command: `npm start`
5. Add environment variable: `NODE_ENV=production`

### Railway
1. Create new project from GitHub
2. Railway auto-detects Node.js
3. Add environment variable: `NODE_ENV=production`
4. Deploy automatically triggers

### Heroku
```bash
heroku create your-app-name
git push heroku main
heroku config:set NODE_ENV=production
```

### AWS Elastic Beanstalk
1. Create application
2. Upload zipped code or connect to GitHub
3. Platform: Node.js
4. Environment: `NODE_ENV=production`

## Next Steps

After deployment, you may want to:
1. **Add Environment Variables** for sensitive data (API keys, database URLs)
2. **Configure CORS** if frontend is on a different domain
3. **Set up Cloud Storage** for uploads (AWS S3, Cloudinary)
4. **Use PostgreSQL/MongoDB** instead of SQLite for production
5. **Add SSL/HTTPS** (usually automatic on modern platforms)
6. **Set up CI/CD** for automatic deployments
7. **Add monitoring** (error tracking, performance monitoring)

## Rollback Instructions

If you need to revert these changes:
```bash
git revert HEAD
```

The application will still work in development mode with separate client/server processes.

