// client/src/App.js
// Main React application for Fresh Takes Fruit Garden

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Garden from './pages/Garden';
import StickerGenerator from './pages/StickerGenerator';
import Shelf from './pages/Shelf';
import './styles/App.css';

// Navigation component with pixel-art icons matching Figma design
function Navigation() {
    const location = useLocation();
    const [hoveredItem, setHoveredItem] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    
    useEffect(() => {
        let ticking = false;
        
        const updateScrollState = () => {
            const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            setIsScrolled(scrollPosition > 50);
            ticking = false;
        };
        
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScrollState);
                ticking = true;
            }
        };
        
        // Initial check
        updateScrollState();
        
        // Listen on window for scroll events
        window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
        
        return () => {
            window.removeEventListener('scroll', handleScroll, { capture: true });
        };
    }, []);
    
    const navItems = [
        { path: '/', label: 'Garden', icon: '/nav-icons/food-drink-fruit-cherry.svg', color: '#000000' },
        { path: '/generate', label: 'Plant Project', icon: '/nav-icons/ecology-plant-growth-soil-nature.svg', color: '#000000' },
        { path: '/shelf', label: 'Harvest Shelf', icon: '/nav-icons/photography-focus-flower.svg', color: '#000000' }
    ];
    
    return (
        <nav className={`main-navigation ${isScrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                <div className={`nav-brand ${isScrolled ? 'hidden' : ''}`}>
                    <img src="/nav-icons/Logo.png" alt="Logo" className="brand-logo" />
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
                            <div className={`nav-icon ${hoveredItem === index ? 'bouncing' : ''}`}>
                                <img src={item.icon} alt={item.label} width="50" height="50" />
                            </div>
                            <span className="nav-label">{item.label}</span>
                            {location.pathname === item.path && (
                                <span className="active-indicator"></span>
                            )}
                        </Link>
                    ))}
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
        const initProjects = async () => {
            console.log('🌱 INIT: Starting project initialization');
            // Add sample projects first
            addSampleProjects();
            console.log('🌱 INIT: Sample projects added, waiting before fetch...');
            // Wait a moment to ensure state is set
            await new Promise(resolve => setTimeout(resolve, 100));
            // Then fetch real projects
            await fetchProjects();
            console.log('🌱 INIT: Initialization complete');
        };
        initProjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    // Add 15 sample projects for testing the flower meadow layout
    const addSampleProjects = () => {
        const adjectives = ['Revolutionary', 'Innovative', 'Disruptive', 'Fresh', 'Bold', 'Crispy', 'Juicy', 'Ripe', 'Organic', 'Sustainable', 'Electric', 'Magnetic', 'Quantum', 'Neural', 'Atomic'];
        const feelings = ['Excited', 'Inspired', 'Energized', 'Empowered', 'Motivated', 'Refreshed', 'Invigorated', 'Enlightened', 'Transformed', 'Charged'];
        const feelingColors = {
            'Excited': '#FEA57D',
            'Inspired': '#ABC9EF',
            'Energized': '#ECC889',
            'Empowered': '#7992B1',
            'Motivated': '#F0A8F6',
            'Refreshed': '#829E86',
            'Invigorated': '#CCBF84',
            'Enlightened': '#FEFFFE',
            'Transformed': '#D9AD99',
            'Charged': '#BBBEA0'
        };
        const projectNames = [
            'AI Assistant', 'Green Energy Hub', 'Urban Farm', 'Smart Home',
            'Cloud Platform', 'Mobile App', 'AR Experience', 'Data Analytics',
            'Social Network', 'E-Commerce Site', 'Learning Platform', 'Health Tracker',
            'Music Streaming', 'Video Editor', 'Design System'
        ];
        
        const sampleProjects = projectNames.map((name, index) => {
            const adjective = adjectives[index];
            const feeling = feelings[index % feelings.length];
            const color = feelingColors[feeling];
            
            return {
                id: `sample-${index}`,
                projectName: name,
                location: 'Innovation Garden',
                creator: 'ADDX Team',
                createdAt: new Date().toISOString(),
                likes: Math.floor(Math.random() * 15),
                stickerData: {
                    fruitType: `shape${(index % 15) + 1}`,
                    color: color
                },
                projectAdjective: adjective,  // Match database field name
                projectFeeling: feeling,      // Match database field name
                adjective: adjective,         // Keep for backwards compatibility
                feeling: feeling,             // Keep for backwards compatibility
                projectLink: `https://example.com/${name.toLowerCase().replace(/ /g, '-')}`
            };
        });
        
        console.log('🌸 SAMPLES: Creating', sampleProjects.length, 'sample projects');
        console.log('🌸 SAMPLES: Sample projects:', sampleProjects);
        setProjects(prev => {
            console.log('🌸 SAMPLES: Previous projects count:', prev.length);
            console.log('🌸 SAMPLES: Setting projects to:', sampleProjects.length);
            return sampleProjects;
        });
    };
    
    
    // Helper function to convert old fruit types to new shape types
    const convertOldFruitToShape = (fruitType) => {
        const fruitToShapeMap = {
            'apple': 'shape1',
            'strawberry': 'shape1',
            'cherry': 'shape1',
            'tomato': 'shape1',
            'orange': 'shape2',
            'mango': 'shape2',
            'peach': 'shape2',
            'pineapple': 'shape2',
            'grape': 'shape3',
            'blueberry': 'shape3',
            'eggplant': 'shape3',
            'kiwi': 'shape4',
            'cucumber': 'shape4',
            'lettuce': 'shape4',
            'avocado': 'shape4',
            'pepper': 'shape5',
            'watermelon': 'shape5',
            'banana': 'shape8',
            'lemon': 'shape8',
            'broccoli': 'shape9',
            'corn': 'shape11',
            'carrot': 'shape6',
            'mushroom': 'shape14',
            'coconut': 'shape14',
            'potato': 'shape14'
        };
        
        return fruitToShapeMap[fruitType] || 'shape1';
    };
    
    const fetchProjects = async () => {
        try {
            console.log('🌐 FETCH: Starting API fetch...');
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/projects');
            const data = await response.json();
            
            console.log('🌐 FETCH: API response:', data);
            
            if (data.success && data.projects && data.projects.length > 0) {
                console.log('🌐 FETCH: Received', data.projects.length, 'projects from API');
                // Convert old fruit types to shapes
                const updatedProjects = data.projects.map(project => {
                    if (project.stickerData && project.stickerData.fruitType) {
                        const oldType = project.stickerData.fruitType;
                        // Only convert if it's not already a shape
                        if (!oldType.startsWith('shape')) {
                            return {
                                ...project,
                                stickerData: {
                                    ...project.stickerData,
                                    fruitType: convertOldFruitToShape(oldType)
                                }
                            };
                        }
                    }
                    return project;
                });
                
                // Merge with existing sample projects instead of replacing
                setProjects(prev => {
                    console.log('🌐 FETCH: Merging - API projects:', updatedProjects.length, 'Existing projects:', prev.length);
                    // Filter out duplicates by id - safely check for id existence
                    const existingIds = new Set(
                        prev.map(p => p._id || p.id).filter(id => id)
                    );
                    const newProjects = updatedProjects.filter(p => {
                        const projectId = p._id || p.id;
                        const isDuplicate = existingIds.has(projectId);
                        console.log('🌐 FETCH: Project', projectId, 'isDuplicate:', isDuplicate);
                        return projectId && !isDuplicate;
                    });
                    const merged = [...newProjects, ...prev];
                    console.log('🌐 FETCH: Final merged count:', merged.length);
                    return merged;
                });
            } else {
                console.log('🌐 FETCH: No projects from API or unsuccessful response');
            }
        } catch (err) {
            console.error('🌐 FETCH: Error fetching projects:', err);
            // Don't set error if we have sample projects - just log it
            console.log('🌐 FETCH: Using sample projects only');
        } finally {
            setLoading(false);
            console.log('🌐 FETCH: Fetch complete');
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