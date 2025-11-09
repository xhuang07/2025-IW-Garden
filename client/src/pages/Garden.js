// client/src/pages/Garden.js
// Interactive Garden page with floating animated fruits

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Fruit from '../components/Fruit';
import FlowerField from '../components/FlowerField';
import '../styles/Garden.css';

function Garden({ projects, onProjectLiked }) {
    const location = useLocation();
    const [selectedProject, setSelectedProject] = useState(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [groupingMode, setGroupingMode] = useState('projectType'); // Lift state for scroll reset
    const [highlightedProjectId, setHighlightedProjectId] = useState(null);
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
    
    // Handle navigation from Shelf page with project highlight
    useEffect(() => {
        if (location.state?.highlightProjectId) {
            const projectId = location.state.highlightProjectId;
            setHighlightedProjectId(projectId);
            
            console.log('🎯 NAV: Navigating to highlight project:', projectId, '(', typeof projectId, ')');
            
            // Wait for component to fully render and D3 simulation to initialize
            setTimeout(() => {
                const flowerFieldContainer = document.querySelector('.flower-field-container');
                const flowerField = flowerFieldContainer?.querySelector('.flower-field');
                const svg = flowerField?.querySelector('svg');
                
                if (!flowerFieldContainer || !flowerField || !svg) {
                    console.error('❌ Missing DOM elements for flower field');
                    return;
                }
                
                // Find the highlighted flower's position
                const flowerGroups = svg.querySelectorAll('.flower-group');
                let targetFlower = null;
                
                flowerGroups.forEach((group, index) => {
                    const transform = group.getAttribute('transform');
                    const projectData = group.__data__?.project;
                    const isProject = group.__data__?.isProject;
                    
                    if (!isProject || !projectData) return;
                    
                    // Check both id and _id properties
                    const dataId = projectData.id || projectData._id;
                    
                    // Find the source project to get its name for additional matching
                    const sourceProject = projects.find(p => (p.id || p._id) === projectId);
                    
                    // Try multiple comparison methods for maximum compatibility
                    const isMatch = (
                        dataId === projectId || 
                        String(dataId) === String(projectId) || 
                        Number(dataId) === Number(projectId) ||
                        (projectData.id && projectData.id === projectId) ||
                        (projectData._id && projectData._id === projectId) ||
                        // Also try matching by project name as fallback
                        (sourceProject && projectData.projectName === sourceProject.projectName)
                    );
                    
                    if (isMatch) {
                        console.log('✅ Found matching flower:', projectData.projectName);
                        // Extract x position from transform="translate(x, y)"
                        const match = transform.match(/translate\(([^,]+),/);
                        if (match) {
                            const flowerX = parseFloat(match[1]);
                            targetFlower = { x: flowerX, element: group };
                        }
                    }
                });
                
                if (!targetFlower) {
                    console.warn('⚠️ Could not locate flower for project ID:', projectId);
                    // Still scroll to the section so user can see the garden
                    flowerFieldContainer.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                    });
                    return;
                }
                
                // Scroll vertically to flower field section
                flowerFieldContainer.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Pan horizontally to show the flower
                const viewportWidth = window.innerWidth;
                const flowerFieldWidth = flowerField.offsetWidth;
                const maxTranslate = -(flowerFieldWidth - viewportWidth);
                
                // Calculate translation to center the flower in viewport
                // Flower is at targetFlower.x, we want it at viewportWidth/2
                let targetTranslateX = -(targetFlower.x - viewportWidth / 2);
                
                // Clamp to valid range
                targetTranslateX = Math.max(maxTranslate, Math.min(0, targetTranslateX));
                
                // Apply translation with smooth transition
                flowerField.style.transition = 'transform 1s ease-out';
                flowerField.style.transform = `translateX(${targetTranslateX}px)`;
                
                // Remove transition after animation completes
                setTimeout(() => {
                    flowerField.style.transition = '';
                }, 1000);
                
                // Clear highlight after a few seconds
                setTimeout(() => {
                    setHighlightedProjectId(null);
                }, 4000);
            }, 1200); // Increased timeout to give D3 more time to initialize
        }
    }, [location, projects]);
    
    // Background transition + Scroll-jacking for flower field horizontal panning
    useEffect(() => {
        const flowerFieldContainer = document.querySelector('.flower-field-container');
        if (!flowerFieldContainer) return;
        
        const flowerField = flowerFieldContainer.querySelector('.flower-field');
        if (!flowerField) return;
        
        const gardenPage = document.querySelector('.garden-page');
        if (!gardenPage) return;
        
        // CRITICAL: Initialize flower field at leftmost position (translateX(0))
        flowerField.style.transform = 'translateX(0)';
        
        let isInFlowerSection = false;
        let flowerScrollProgress = 0; // 0 to 1
        let lockedScrollPosition = 0;
        
        // Calculate dimensions and positions
        const getDimensions = () => {
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const pageHeight = gardenPage.offsetHeight;
            const containerHeight = flowerFieldContainer.offsetHeight;
            const containerTop = pageHeight - containerHeight;
            const scrollStart = Math.max(0, containerTop - viewportHeight + containerHeight);
            const flowerFieldWidth = flowerField.offsetWidth;
            const overflowWidth = flowerFieldWidth - viewportWidth;
            
            return {
                viewportHeight,
                viewportWidth,
                scrollStart,
                overflowWidth,
                containerTop
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
                // Ensure we start at leftmost position
                flowerField.style.transform = 'translateX(0)';
            }
            
            // If not in flower section yet, keep flower field at start position
            if (scrollPosition < dimensions.scrollStart) {
                flowerField.style.transform = 'translateX(0)';
            }
        };
        
        // Handle wheel events for scroll-jacking in flower section (linear, no loop)
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
                
                // Check for exit condition: scrolling up at leftmost
                if (isScrollingUp && flowerScrollProgress <= 0) {
                    // User wants to scroll up and is at leftmost - exit flower section
                    isInFlowerSection = false;
                    // Don't prevent default - allow normal upward scroll
                    return; // Exit handler to allow normal scroll
                }
                
                // Check for exit condition: scrolling down at rightmost
                if (isScrollingDown && flowerScrollProgress >= 1) {
                    // User wants to scroll down and is at rightmost - exit flower section
                    isInFlowerSection = false;
                    // Don't prevent default - allow normal downward scroll
                    return; // Exit handler to allow normal scroll
                }
                
                // Capture scroll events for horizontal panning
                e.preventDefault();
                
                // Convert wheel delta to scroll progress
                // Positive deltaY = scrolling down = move content left (increase progress)
                // Negative deltaY = scrolling up = move content right (decrease progress)
                const sensitivity = 0.001;
                const delta = e.deltaY * sensitivity;
                
                flowerScrollProgress += delta;
                
                // Clamp progress between 0 and 1 (no looping)
                flowerScrollProgress = Math.max(0, Math.min(1, flowerScrollProgress));
                
                // Apply horizontal translation (only to flower-field, not the toggle buttons)
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
    }, [groupingMode]); // Reset scroll position when grouping changes
    
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
                <button className="enter-garden-button" onClick={handleEnterGarden}>
                    <svg className="svgIcon" viewBox="0 0 384 512">
                        <path
                            d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"
                        ></path>
                    </svg>
                </button>
            </div>
            
            {/* Garden Controls - Hidden for clean flower meadow view */}
            
            {/* Unified Flower Field - Interactive with D3 drag and click */}
            <FlowerField 
                projects={projects}
                onFlowerClick={handleFruitClick}
                groupingMode={groupingMode}
                onGroupingChange={setGroupingMode}
                highlightedProjectId={highlightedProjectId}
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