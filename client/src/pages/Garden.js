// client/src/pages/Garden.js
// Interactive Garden page with floating animated fruits

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Fruit from '../components/Fruit';
import '../styles/Garden.css';

function Garden({ projects, onProjectLiked }) {
    const [selectedProject, setSelectedProject] = useState(null);
    const [gardenView, setGardenView] = useState('floating'); // 'floating', 'tree', 'grid'
    const [season, setSeason] = useState('summer');
    const gardenRef = useRef(null);
    
    // Create floating particles effect
    useEffect(() => {
        const particles = [];
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'garden-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            particle.innerHTML = ['🍃', '🌸', '✨', '🦋'][Math.floor(Math.random() * 4)];
            gardenRef.current?.appendChild(particle);
            particles.push(particle);
        }
        
        return () => {
            particles.forEach(p => p.remove());
        };
    }, []);
    
    // Garden layout configurations
    const getProjectPosition = (project, index) => {
        switch (gardenView) {
            case 'tree':
                // Arrange in tree-like clusters
                const treeRow = Math.floor(index / 5);
                const treeCol = index % 5;
                return {
                    x: 20 + (treeCol * 15) + (treeRow % 2 ? 7 : 0) + Math.random() * 5,
                    y: 15 + (treeRow * 20) + Math.random() * 5,
                    scale: 0.8 + Math.random() * 0.4
                };
            
            case 'grid':
                // Neat grid arrangement
                const gridCols = 6;
                const col = index % gridCols;
                const row = Math.floor(index / gridCols);
                return {
                    x: 10 + (col * 15),
                    y: 20 + (row * 20),
                    scale: 1
                };
            
            case 'floating':
            default:
                // Use database positions or random
                return {
                    x: project.positionX || (10 + Math.random() * 80),
                    y: project.positionY || (20 + Math.random() * 60),
                    scale: 0.8 + Math.random() * 0.4
                };
        }
    };
    
    // Season effects
    const getSeasonClass = () => {
        const seasonClasses = {
            spring: 'season-spring',
            summer: 'season-summer',
            autumn: 'season-autumn',
            winter: 'season-winter'
        };
        return seasonClasses[season] || '';
    };
    
    const handleFruitClick = (project) => {
        setSelectedProject(project);
    };
    
    const closeProjectModal = () => {
        setSelectedProject(null);
    };
    
    const handleLikeProject = (e, projectId) => {
        e.stopPropagation();
        onProjectLiked(projectId);
        
        // Create heart animation
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = '❤️';
        heart.style.left = e.clientX + 'px';
        heart.style.top = e.clientY + 'px';
        document.body.appendChild(heart);
        
        setTimeout(() => heart.remove(), 2000);
    };
    
    return (
        <div className={`garden-page ${getSeasonClass()}`} ref={gardenRef}>
            {/* Garden Controls */}
            <div className="garden-controls">
                <div className="view-switcher">
                    <button
                        className={gardenView === 'floating' ? 'active' : ''}
                        onClick={() => setGardenView('floating')}
                        title="Floating Garden"
                    >
                        🎈
                    </button>
                    <button
                        className={gardenView === 'tree' ? 'active' : ''}
                        onClick={() => setGardenView('tree')}
                        title="Orchard View"
                    >
                        🌳
                    </button>
                    <button
                        className={gardenView === 'grid' ? 'active' : ''}
                        onClick={() => setGardenView('grid')}
                        title="Grid View"
                    >
                        📱
                    </button>
                </div>
                
                <div className="season-switcher">
                    <select 
                        value={season} 
                        onChange={(e) => setSeason(e.target.value)}
                        className="season-select"
                    >
                        <option value="spring">🌸 Spring</option>
                        <option value="summer">☀️ Summer</option>
                        <option value="autumn">🍂 Autumn</option>
                        <option value="winter">❄️ Winter</option>
                    </select>
                </div>
            </div>
            
            {/* Garden Title */}
            <motion.div 
                className="garden-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="garden-title">
                    <span className="title-emoji">🌱</span>
                    The Innovation Garden
                    <span className="title-emoji">🌱</span>
                </h1>
                <p className="garden-subtitle">
                    Where fresh ideas bloom and grow
                </p>
            </motion.div>
            
            {/* Fruit Garden */}
            <div className={`fruit-garden view-${gardenView}`}>
                {gardenView === 'tree' && (
                    <div className="tree-branches">
                        <svg className="branch-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path
                                d="M50 80 Q30 60 20 40 M50 80 Q70 60 80 40 M50 80 Q50 60 50 40"
                                stroke="brown"
                                strokeWidth="2"
                                fill="none"
                                opacity="0.3"
                            />
                        </svg>
                    </div>
                )}
                
                <AnimatePresence>
                    {projects.map((project, index) => {
                        const position = getProjectPosition(project, index);
                        return (
                            <motion.div
                                key={project.id}
                                className="fruit-container"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ 
                                    opacity: 1, 
                                    scale: position.scale,
                                    x: position.x + '%',
                                    y: position.y + '%'
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20
                                }}
                                whileHover={{ 
                                    scale: position.scale * 1.2,
                                    rotate: [0, -5, 5, -5, 0],
                                    transition: { duration: 0.5 }
                                }}
                                onClick={() => handleFruitClick(project)}
                                style={{
                                    position: 'absolute',
                                    left: position.x + '%',
                                    top: position.y + '%',
                                    transform: 'translate(-50%, -50%)'
                                }}
                            >
                                <Fruit 
                                    type={project.stickerData?.fruitType || 'apple'}
                                    size="medium"
                                    animated={true}
                                    glowing={project.likes > 5}
                                />
                                <div className="fruit-label">
                                    <span className="fruit-name">{project.projectName}</span>
                                    {project.likes > 0 && (
                                        <span className="fruit-likes">❤️ {project.likes}</span>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                
                {projects.length === 0 && (
                    <div className="empty-garden">
                        <span className="empty-emoji">🌱</span>
                        <h3>The garden is ready for planting!</h3>
                        <p>Be the first to plant a project</p>
                    </div>
                )}
            </div>
            
            {/* Project Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div 
                        className="project-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeProjectModal}
                    >
                        <motion.div 
                            className="project-modal"
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 50 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button className="modal-close" onClick={closeProjectModal}>
                                ✕
                            </button>
                            
                            <div className="modal-header">
                                <Fruit 
                                    type={selectedProject.stickerData?.fruitType || 'apple'}
                                    size="large"
                                    animated={false}
                                />
                                <h2>{selectedProject.projectName}</h2>
                            </div>
                            
                            <div className="modal-content">
                                <div className="project-info">
                                    <p><strong>🌍 Location:</strong> {selectedProject.location}</p>
                                    <p><strong>👤 Gardener:</strong> {selectedProject.creator}</p>
                                    <p><strong>📅 Planted:</strong> {new Date(selectedProject.createdAt).toLocaleDateString()}</p>
                                    <p><strong>❤️ Likes:</strong> {selectedProject.likes || 0}</p>
                                </div>
                                
                                {selectedProject.screenshot && (
                                    <div className="project-screenshot">
                                        <img 
                                            src={`http://localhost:5000${selectedProject.screenshot}`} 
                                            alt={selectedProject.projectName}
                                        />
                                    </div>
                                )}
                                
                                <div className="project-actions">
                                    <button 
                                        className="like-button"
                                        onClick={(e) => handleLikeProject(e, selectedProject.id)}
                                    >
                                        ❤️ Water with Love
                                    </button>
                                    
                                    {selectedProject.projectLink && (
                                        <a 
                                            href={selectedProject.projectLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="visit-button"
                                        >
                                            🔗 Visit Project
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Garden;