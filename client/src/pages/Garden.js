// client/src/pages/Garden.js
// Interactive Garden page with floating animated fruits

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Fruit from '../components/Fruit';
import FlowerField from '../components/FlowerField';
import '../styles/Garden.css';

function Garden({ projects, onProjectLiked }) {
    const [selectedProject, setSelectedProject] = useState(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const gardenRef = useRef(null);
    
    // Debug: Log projects to verify data
    useEffect(() => {
        console.log('🌻 GARDEN: Component received projects:', projects.length);
        console.log('🌻 GARDEN: Projects data:', projects);
        if (projects.length === 0) {
            console.warn('🌻 GARDEN: NO PROJECTS RECEIVED!');
        }
    }, [projects]);
    
    // Initialize Unicorn Studio animation
    useEffect(() => {
        const initUnicornStudio = () => {
            if (window.UnicornStudio && window.UnicornStudio.isInitialized) {
                console.log('Unicorn Studio initialized successfully');
            } else if (window.UnicornStudio) {
                window.UnicornStudio.init();
                console.log('Unicorn Studio init called');
            } else {
                console.log('Waiting for Unicorn Studio to load...');
                setTimeout(initUnicornStudio, 500);
            }
        };
        
        initUnicornStudio();
    }, []);
    
    // Background transition + Scroll-jacking for flower field horizontal panning
    useEffect(() => {
        const flowerField = document.querySelector('.flower-field');
        if (!flowerField) return;
        
        const flowerFieldParent = flowerField.parentElement;
        if (!flowerFieldParent) return;
        
        let isInFlowerSection = false;
        let flowerScrollProgress = 0; // 0 to 1
        let lockedScrollPosition = 0;
        
        // Calculate dimensions and positions
        const getDimensions = () => {
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const pageHeight = flowerFieldParent.offsetHeight;
            const flowerFieldHeight = flowerField.offsetHeight;
            const flowerFieldTop = pageHeight - flowerFieldHeight;
            const scrollStart = Math.max(0, flowerFieldTop - viewportHeight + flowerFieldHeight);
            const flowerFieldWidth = flowerField.offsetWidth;
            const overflowWidth = flowerFieldWidth - viewportWidth;
            
            return {
                viewportHeight,
                viewportWidth,
                scrollStart,
                overflowWidth,
                flowerFieldTop
            };
        };
        
        let dimensions = getDimensions();
        
        // Handle regular scroll updates
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            
            // Background blur effect
            const progress = scrollPosition > 0 ? 1 : 0;
            setScrollProgress(progress);
            
            // Update dimensions
            dimensions = getDimensions();
            
            // Check if we've reached the flower section
            if (scrollPosition >= dimensions.scrollStart && !isInFlowerSection) {
                isInFlowerSection = true;
                lockedScrollPosition = scrollPosition;
                flowerScrollProgress = 0;
            }
            
            // If not in flower section yet, keep flower field at start position
            if (scrollPosition < dimensions.scrollStart) {
                flowerField.style.transform = 'translateX(0)';
            }
        };
        
        // Handle wheel events for scroll-jacking in flower section with looping
        const handleWheel = (e) => {
            dimensions = getDimensions();
            const scrollPosition = window.scrollY;
            
            // Detect scroll direction
            const isScrollingDown = e.deltaY > 0;
            const isScrollingUp = e.deltaY < 0;
            
            // Check if we're in or entering the flower section
            if (scrollPosition >= dimensions.scrollStart) {
                if (!isInFlowerSection) {
                    isInFlowerSection = true;
                    lockedScrollPosition = scrollPosition;
                    flowerScrollProgress = 0;
                }
                
                // Check for exit condition (only when scrolling up at leftmost)
                if (isScrollingUp && flowerScrollProgress <= 0) {
                    // User wants to scroll up and is at leftmost - exit flower section
                    isInFlowerSection = false;
                    // Don't prevent default - allow normal upward scroll
                    return; // Exit handler to allow normal scroll
                }
                
                // Otherwise, capture all scroll events for panning/looping
                e.preventDefault();
                
                // Convert wheel delta to scroll progress
                // Positive deltaY = scrolling down = move content left (increase progress)
                // Negative deltaY = scrolling up = move content right (decrease progress)
                const sensitivity = 0.001;
                const delta = e.deltaY * sensitivity;
                
                flowerScrollProgress += delta;
                
                // Handle looping when scrolling down past rightmost
                if (flowerScrollProgress >= 1) {
                    // Loop back to start seamlessly
                    // Carry over any excess scroll progress for smooth continuation
                    const excess = flowerScrollProgress - 1;
                    flowerScrollProgress = excess;
                    
                    // Note: No visual transition needed - the modulo effect creates seamless loop
                    // The transform will be recalculated below with the new progress value
                }
                
                // Clamp progress for scrolling up (can't go below 0)
                flowerScrollProgress = Math.max(0, flowerScrollProgress);
                
                // Apply horizontal translation
                const translateX = -(flowerScrollProgress * dimensions.overflowWidth);
                flowerField.style.transform = `translateX(${translateX}px)`;
                
                // Lock scroll position (keep page at flower section)
                window.scrollTo(0, lockedScrollPosition);
                
            } else if (scrollPosition < dimensions.scrollStart && isInFlowerSection) {
                // User scrolled above flower section - reset state
                isInFlowerSection = false;
                flowerScrollProgress = 0;
                flowerField.style.transform = 'translateX(0)';
            }
        };
        
        // Handle resize
        const handleResize = () => {
            dimensions = getDimensions();
            // Reapply current translation
            if (isInFlowerSection || flowerScrollProgress > 0) {
                const translateX = -(flowerScrollProgress * dimensions.overflowWidth);
                flowerField.style.transform = `translateX(${translateX}px)`;
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('wheel', handleWheel, { passive: false });
        window.addEventListener('resize', handleResize);
        
        handleScroll(); // Initial call
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
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
    
    const handleEnterGarden = () => {
        // Jump to bottom where flowers are
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    };
    
    return (
        <div className="garden-page" ref={gardenRef}>
            {/* Background Image with Scroll-based Blur Effect */}
            <div className="garden-background-container">
                <div 
                    className="garden-background"
                    style={{
                        backgroundImage: 'url(/Background.png)',
                        filter: `blur(${(1 - scrollProgress) * 10}px)`,
                        opacity: 0.9 + (scrollProgress * 0.1)
                    }}
                />
            </div>
            
            {/* Unicorn Studio Background Animation */}
            <div 
                className="unicorn-studio-background"
                data-us-project="oJqvmvXDrhQFEhdCz7z6"
            />
            
            {/* Hero Section - Above the Fold */}
            <div className="hero-section">
                <h1 className="hero-title">Innovation garden</h1>
                <button className="hero-button" onClick={handleEnterGarden}>
                    Enter the garden
                </button>
            </div>
            
            {/* Garden Controls - Hidden for clean flower meadow view */}
            
            {/* Unified Flower Field - Interactive with D3 drag and click */}
            <FlowerField 
                projects={projects}
                onFlowerClick={handleFruitClick}
            />
            
            {/* Show empty state if no projects */}
            {projects.length === 0 && (
                <div className="empty-garden" style={{ position: 'absolute', bottom: '200px', left: '50%', transform: 'translateX(-50%)', zIndex: 200 }}>
                    <span className="empty-emoji">🌱</span>
                    <h3>The garden is ready for planting!</h3>
                    <p>Be the first to plant a project</p>
                </div>
            )}
            
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