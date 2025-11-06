// client/src/App.js
// Main React application for Fresh Takes Fruit Garden

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Garden from './pages/Garden';
import StickerGenerator from './pages/StickerGenerator';
import Shelf from './pages/Shelf';
import './styles/App.css';

// Navigation component with animated fruit icons
function Navigation() {
    const location = useLocation();
    const [hoveredItem, setHoveredItem] = useState(null);
    
    const navItems = [
        { path: '/', label: 'Garden', emoji: '🌱', color: '#4CAF50' },
        { path: '/generate', label: 'Plant Project', emoji: '🍎', color: '#FF6B6B' },
        { path: '/shelf', label: 'Harvest Shelf', emoji: '🥬', color: '#8BC34A' }
    ];
    
    return (
        <nav className="main-navigation">
            <div className="nav-container">
                <div className="nav-brand">
                    <span className="brand-emoji">🍅</span>
                    <h1>Fresh Takes Garden</h1>
                    <span className="brand-tagline">Innovation Growing Daily</span>
                </div>
                
                <div className="nav-links">
                    {navItems.map((item, index) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                            onMouseEnter={() => setHoveredItem(index)}
                            onMouseLeave={() => setHoveredItem(null)}
                            style={{
                                '--hover-color': item.color,
                                animationDelay: `${index * 0.1}s`
                            }}
                        >
                            <span className={`nav-emoji ${hoveredItem === index ? 'bouncing' : ''}`}>
                                {item.emoji}
                            </span>
                            <span className="nav-label">{item.label}</span>
                            {location.pathname === item.path && (
                                <span className="active-indicator"></span>
                            )}
                        </Link>
                    ))}
                </div>
                
                <div className="nav-stats">
                    <div className="stat-item">
                        <span className="stat-value" id="project-count">0</span>
                        <span className="stat-label">Projects Growing</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}

// Loading animation component
function LoadingGarden() {
    return (
        <div className="loading-garden">
            <div className="loading-fruits">
                {['🍎', '🍊', '🍇', '🍓', '🥝'].map((fruit, i) => (
                    <span 
                        key={i} 
                        className="loading-fruit"
                        style={{ animationDelay: `${i * 0.2}s` }}
                    >
                        {fruit}
                    </span>
                ))}
            </div>
            <p>Watering the garden...</p>
        </div>
    );
}

// Main App Component
function App() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Fetch projects on mount
    useEffect(() => {
        fetchProjects();
    }, []);
    
    // Update project count
    useEffect(() => {
        const countElement = document.getElementById('project-count');
        if (countElement) {
            countElement.textContent = projects.length;
            countElement.classList.add('pop-animation');
            setTimeout(() => countElement.classList.remove('pop-animation'), 300);
        }
    }, [projects]);
    
    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/projects');
            const data = await response.json();
            
            if (data.success) {
                setProjects(data.projects);
            } else {
                setError('Failed to load garden');
            }
        } catch (err) {
            console.error('Error fetching projects:', err);
            setError('Could not connect to garden server');
        } finally {
            setLoading(false);
        }
    };
    
    const handleProjectAdded = (newProject) => {
        setProjects(prev => [newProject, ...prev]);
        // Show success animation
        showNotification('🌱 New project planted in the garden!');
    };
    
    const handleProjectLiked = (projectId) => {
        setProjects(prev => prev.map(p => 
            p.id === projectId 
                ? { ...p, likes: (p.likes || 0) + 1 }
                : p
        ));
        showNotification('❤️ Project liked!');
    };
    
    const showNotification = (message) => {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    };
    
    if (loading) return <LoadingGarden />;
    
    if (error) {
        return (
            <div className="error-container">
                <span className="error-emoji">🥀</span>
                <h2>Garden needs attention!</h2>
                <p>{error}</p>
                <button onClick={fetchProjects} className="retry-button">
                    Try watering again 💧
                </button>
            </div>
        );
    }
    
    return (
        <Router>
            <div className="app">
                <Navigation />
                
                <main className="main-content">
                    <Routes>
                        <Route 
                            path="/" 
                            element={
                                <Garden 
                                    projects={projects}
                                    onProjectLiked={handleProjectLiked}
                                />
                            } 
                        />
                        <Route 
                            path="/generate" 
                            element={
                                <StickerGenerator 
                                    onProjectAdded={handleProjectAdded}
                                />
                            } 
                        />
                        <Route 
                            path="/shelf" 
                            element={
                                <Shelf 
                                    projects={projects}
                                    onProjectLiked={handleProjectLiked}
                                />
                            } 
                        />
                    </Routes>
                </main>
                
                <footer className="app-footer">
                    <div className="footer-content">
                        <p>🌱 Fresh Takes Innovation Week 2024</p>
                        <p className="footer-quote">
                            "How might we reimagine our portfolio by focusing on the next generation"
                        </p>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;