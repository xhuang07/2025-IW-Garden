// server/server.js
// Express server for Fresh Takes Garden API

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { initDB, getProjects, addProject, likeProject, searchProjects } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'project-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Initialize database
initDB();

// API Routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: '🌱 Fresh Takes Garden API is growing!',
        timestamp: new Date().toISOString()
    });
});

// Get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await getProjects();
        res.json({
            success: true,
            projects: projects,
            count: projects.length
        });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch projects from the garden',
            error: error.message
        });
    }
});

// Search projects
app.get('/api/projects/search', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }
        
        const projects = await searchProjects(q);
        res.json({
            success: true,
            projects: projects,
            count: projects.length,
            query: q
        });
    } catch (error) {
        console.error('Error searching projects:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search projects',
            error: error.message
        });
    }
});

// Add new project
app.post('/api/projects', upload.single('screenshot'), async (req, res) => {
    try {
        const { projectName, location, creator, projectLink, fruitType, stickerColor, projectAdjective, projectFeeling } = req.body;
        
        if (!projectName || !location) {
            return res.status(400).json({
                success: false,
                message: 'Project name and location are required'
            });
        }
        
        // Create sticker data
        const stickerData = {
            fruitType: fruitType || 'shape1',
            color: stickerColor || '#FEA57D',
            text: `I grow ${projectName} in ${location}`
        };
        
        const projectData = {
            projectName,
            location,
            creator: creator || 'Anonymous Gardener',
            projectLink: projectLink || null,
            screenshot: req.file ? `/uploads/${req.file.filename}` : null,
            stickerData: JSON.stringify(stickerData),
            projectAdjective: projectAdjective || null,
            projectFeeling: projectFeeling || null,
            fruitType: fruitType || 'shape1'
        };
        
        const newProject = await addProject(projectData);
        
        res.status(201).json({
            success: true,
            message: '🌱 Project planted successfully!',
            project: newProject
        });
    } catch (error) {
        console.error('Error adding project:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to plant project in the garden',
            error: error.message
        });
    }
});

// Like a project
app.post('/api/projects/:id/like', async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        
        if (isNaN(projectId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID'
            });
        }
        
        const updatedProject = await likeProject(projectId);
        
        res.json({
            success: true,
            message: '❤️ Project liked!',
            project: updatedProject
        });
    } catch (error) {
        console.error('Error liking project:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to like project',
            error: error.message
        });
    }
});

// Get single project by ID
app.get('/api/projects/:id', async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        
        if (isNaN(projectId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID'
            });
        }
        
        const projects = await getProjects();
        const project = projects.find(p => p.id === projectId);
        
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found in the garden'
            });
        }
        
        res.json({
            success: true,
            project: project
        });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch project',
            error: error.message
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '🥀 Route not found in the garden'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Something went wrong in the garden!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
    🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱
    
    🍅 Fresh Takes Garden API 🍅
    
    Server is growing on port ${PORT}
    Health check: http://localhost:${PORT}/api/health
    
    🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱🌱
    `);
});

module.exports = app;

