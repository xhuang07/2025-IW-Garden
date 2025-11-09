// server/database.js
// SQLite database operations for Fresh Takes Garden

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, '..', 'database', 'garden.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('🌱 Connected to the Fresh Takes Garden database');
    }
});

// Initialize database tables
function initDB() {
    const createTableSQL = `
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            projectName TEXT NOT NULL,
            location TEXT NOT NULL,
            creator TEXT DEFAULT 'Anonymous Gardener',
            projectLink TEXT,
            screenshot TEXT,
            stickerData TEXT,
            likes INTEGER DEFAULT 0,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            fruitType TEXT DEFAULT 'tomato',
            positionX REAL DEFAULT 0,
            positionY REAL DEFAULT 0,
            gardenRow INTEGER DEFAULT 0,
            projectAdjective TEXT,
            projectFeeling TEXT
        )
    `;
    
    db.run(createTableSQL, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('✅ Projects table ready');
            // Run migrations to add any missing columns
            runMigrations();
        }
    });
}

// Run database migrations to add missing columns
function runMigrations() {
    // Check if projectAdjective column exists, if not add it
    db.all("PRAGMA table_info(projects)", (err, columns) => {
        if (err) {
            console.error('Error checking table structure:', err);
            seedInitialData();
            return;
        }
        
        const hasAdjective = columns.some(col => col.name === 'projectAdjective');
        const hasFeeling = columns.some(col => col.name === 'projectFeeling');
        
        if (!hasAdjective) {
            console.log('🔄 Adding projectAdjective column...');
            db.run("ALTER TABLE projects ADD COLUMN projectAdjective TEXT", (err) => {
                if (err && !err.message.includes('duplicate column')) {
                    console.error('Error adding projectAdjective column:', err);
                } else {
                    console.log('✅ projectAdjective column added');
                }
                checkFeelingColumn();
            });
        } else {
            checkFeelingColumn();
        }
        
        function checkFeelingColumn() {
            if (!hasFeeling) {
                console.log('🔄 Adding projectFeeling column...');
                db.run("ALTER TABLE projects ADD COLUMN projectFeeling TEXT", (err) => {
                    if (err && !err.message.includes('duplicate column')) {
                        console.error('Error adding projectFeeling column:', err);
                    } else {
                        console.log('✅ projectFeeling column added');
                    }
                    seedInitialData();
                });
            } else {
                seedInitialData();
            }
        }
    });
}

// Seed some initial demo data
function seedInitialData() {
    db.get("SELECT COUNT(*) as count FROM projects", (err, row) => {
        if (err) {
            console.error('Error checking data:', err);
            return;
        }
        
        if (row.count === 0) {
            console.log('🌱 Seeding initial garden data...');
            const demoProjects = [
                {
                    projectName: "AI Assistant Bot",
                    location: "Innovation Lab",
                    creator: "Alex Chen",
                    projectLink: "https://example.com/ai-bot",
                    fruitType: "shape1",
                    projectAdjective: "Revolutionary",
                    projectFeeling: "Excited",
                    stickerData: JSON.stringify({
                        fruitType: "shape1",
                        color: "#FEA57D",
                        text: "I grow AI Assistant Bot in Innovation Lab"
                    })
                },
                {
                    projectName: "Customer Dashboard 2.0",
                    location: "UX Studio",
                    creator: "Sarah Kim",
                    projectLink: "https://example.com/dashboard",
                    fruitType: "shape2",
                    projectAdjective: "Innovative",
                    projectFeeling: "Inspired",
                    stickerData: JSON.stringify({
                        fruitType: "shape2",
                        color: "#ABC9EF",
                        text: "I grow Customer Dashboard 2.0 in UX Studio"
                    })
                },
                {
                    projectName: "Data Pipeline Optimizer",
                    location: "Backend Cave",
                    creator: "Mike Johnson",
                    projectLink: "https://example.com/pipeline",
                    fruitType: "shape8",
                    projectAdjective: "Ripe",
                    projectFeeling: "Charged",
                    stickerData: JSON.stringify({
                        fruitType: "shape8",
                        color: "#BBBEA0",
                        text: "I grow Data Pipeline Optimizer in Backend Cave"
                    })
                }
            ];
            
            const stmt = db.prepare(`
                INSERT INTO projects (projectName, location, creator, projectLink, fruitType, stickerData, positionX, positionY, gardenRow, projectAdjective, projectFeeling)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            demoProjects.forEach((project, index) => {
                const posX = Math.random() * 80 + 10; // Random position 10-90%
                const posY = Math.random() * 60 + 20; // Random position 20-80%
                const row = Math.floor(index / 3); // Organize in rows
                
                stmt.run(
                    project.projectName,
                    project.location,
                    project.creator,
                    project.projectLink,
                    project.fruitType,
                    project.stickerData,
                    posX,
                    posY,
                    row,
                    project.projectAdjective,
                    project.projectFeeling
                );
            });
            
            stmt.finalize();
            console.log('✅ Demo projects planted in the garden!');
        }
    });
}

// Get all projects
function getProjects() {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM projects ORDER BY createdAt DESC";
        db.all(query, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                // Parse stickerData JSON for each project
                const projects = rows.map(row => ({
                    ...row,
                    stickerData: row.stickerData ? JSON.parse(row.stickerData) : null
                }));
                resolve(projects);
            }
        });
    });
}

// Add a new project
function addProject(projectData) {
    return new Promise((resolve, reject) => {
        const { projectName, location, creator, projectLink, screenshot, stickerData, projectAdjective, projectFeeling, fruitType } = projectData;
        
        // Generate random garden position
        const posX = Math.random() * 80 + 10;
        const posY = Math.random() * 60 + 20;
        const gardenRow = Math.floor(Math.random() * 5);
        
        const query = `
            INSERT INTO projects (projectName, location, creator, projectLink, screenshot, stickerData, positionX, positionY, gardenRow, projectAdjective, projectFeeling, fruitType)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.run(query, [projectName, location, creator, projectLink, screenshot, stickerData, posX, posY, gardenRow, projectAdjective, projectFeeling, fruitType], function(err) {
            if (err) {
                reject(err);
            } else {
                // Return the newly created project
                db.get("SELECT * FROM projects WHERE id = ?", [this.lastID], (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            ...row,
                            stickerData: row.stickerData ? JSON.parse(row.stickerData) : null
                        });
                    }
                });
            }
        });
    });
}

// Like a project
function likeProject(projectId) {
    return new Promise((resolve, reject) => {
        const query = "UPDATE projects SET likes = likes + 1 WHERE id = ?";
        db.run(query, [projectId], function(err) {
            if (err) {
                reject(err);
            } else {
                db.get("SELECT * FROM projects WHERE id = ?", [projectId], (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            ...row,
                            stickerData: row.stickerData ? JSON.parse(row.stickerData) : null
                        });
                    }
                });
            }
        });
    });
}

// Search projects
function searchProjects(searchQuery) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT * FROM projects 
            WHERE projectName LIKE ? 
            OR location LIKE ? 
            OR creator LIKE ?
            ORDER BY createdAt DESC
        `;
        const searchPattern = `%${searchQuery}%`;
        
        db.all(query, [searchPattern, searchPattern, searchPattern], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const projects = rows.map(row => ({
                    ...row,
                    stickerData: row.stickerData ? JSON.parse(row.stickerData) : null
                }));
                resolve(projects);
            }
        });
    });
}

// Export functions
module.exports = {
    initDB,
    getProjects,
    addProject,
    likeProject,
    searchProjects
};