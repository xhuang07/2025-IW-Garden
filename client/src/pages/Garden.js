// client/src/pages/Garden.js
// Interactive Garden page with floating animated fruits

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Fruit from '../components/Fruit';
import FlowerField from '../components/FlowerField';
import { API_BASE_URL } from '../config';
import '../styles/Garden.css';

function Garden({ projects, onProjectLiked, onProjectDeleted }) {
    const location = useLocation();
    const [selectedProject, setSelectedProject] = useState(null);
    const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [groupingMode, setGroupingMode] = useState('all'); // Default to 'all' - ungrouped view
    const [highlightedProjectId, setHighlightedProjectId] = useState(null);
    const [isEditingLink, setIsEditingLink] = useState(false);
    const [editedLink, setEditedLink] = useState('');
    const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
    const gardenRef = useRef(null);
    const modalRef = useRef(null);
    const hasBeenDragged = useRef(false);
    const highlightTimeoutRef = useRef(null);
    const hasHandledInitialNavigation = useRef(false);
    const dragRef = useRef({
        isDragging: false,
        startX: 0,
        startY: 0,
        modalStartX: 0,
        modalStartY: 0
    });
    
    // Debug: Log projects to verify data
    useEffect(() => {
        console.log('🌻 GARDEN: Component received projects:', projects.length);
        console.log('🌻 GARDEN: Projects data:', projects);
        if (projects.length === 0) {
            console.warn('🌻 GARDEN: NO PROJECTS RECEIVED!');
        }
    }, [projects]);
    
    // Ensure page starts at top on initial mount (prevent auto-scroll)
    useEffect(() => {
        // Only scroll to top if this is the initial page load (no highlight navigation)
        if (!location.state?.highlightProjectId) {
            window.scrollTo(0, 0);
            console.log('📍 Scrolled to top on mount');
        }
    }, []); // Empty dependency array = runs only once on mount
    
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
        // Only run if:
        // 1. There's a highlightProjectId in location state
        // 2. We haven't handled navigation yet (prevents running multiple times)
        // 3. Projects are loaded (prevents race condition)
        if (location.state?.highlightProjectId && !hasHandledInitialNavigation.current && projects.length > 0) {
            const projectId = location.state.highlightProjectId;
            
            // Mark as handled to prevent running again
            hasHandledInitialNavigation.current = true;
            
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
    
    // Position modal at top-right corner when it first opens
    useEffect(() => {
        if (selectedProject && modalRef.current && !hasBeenDragged.current) {
            requestAnimationFrame(() => {
                const modal = modalRef.current;
                if (!modal) return;
                
                const viewportWidth = window.innerWidth;
                const modalWidth = modal.offsetWidth || 600;
                const snapMargin = 40;
                
                // Position at top-right corner
                modal.style.left = `${viewportWidth - modalWidth - snapMargin}px`;
                modal.style.top = `${snapMargin}px`;
                modal.style.right = 'auto';
                modal.style.transform = 'none';
            });
        }
    }, [selectedProject]);
    
    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!selectedProject) return;
            
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                handlePreviousProject();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                handleNextProject();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closeProjectModal();
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedProject, currentProjectIndex, projects]);
    
    // Auto-clear highlight after 5 seconds
    useEffect(() => {
        // Clear any existing timeout
        if (highlightTimeoutRef.current) {
            clearTimeout(highlightTimeoutRef.current);
            highlightTimeoutRef.current = null;
        }
        
        // If there's a highlighted project, set a timeout to clear it
        if (highlightedProjectId) {
            console.log('⏱️ Setting 5-second highlight timeout for project:', highlightedProjectId);
            highlightTimeoutRef.current = setTimeout(() => {
                console.log('⏱️ Clearing highlight after 5 seconds');
                setHighlightedProjectId(null);
                highlightTimeoutRef.current = null;
            }, 5000);
        }
        
        // Cleanup function
        return () => {
            if (highlightTimeoutRef.current) {
                clearTimeout(highlightTimeoutRef.current);
                highlightTimeoutRef.current = null;
            }
        };
    }, [highlightedProjectId]);
    
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
    
    const handleFruitClick = useCallback((project) => {
        console.log('🌸 Flower clicked:', project.projectName, 'ID:', project.id || project._id);
        console.log('🌸 Current selectedProject:', selectedProject?.projectName);
        
        const projectId = project.id || project._id;
        
        if (selectedProject) {
            // Modal is already open - just update the content
            const index = projects.findIndex(p => {
                const pId = p.id || p._id;
                console.log(`  Comparing: ${p.projectName} (${pId}) with ${project.projectName} (${projectId})`);
                return pId === projectId || String(pId) === String(projectId);
            });
            console.log('🌸 Found index:', index, 'for project:', project.projectName);
            if (index !== -1) {
                setCurrentProjectIndex(index);
                setSelectedProject(projects[index]);
                setHighlightedProjectId(projectId);
                console.log('🌸 Updated to project at index', index, ':', projects[index].projectName);
            }
        } else {
            // Modal is closed - open it
            const index = projects.findIndex(p => {
                const pId = p.id || p._id;
                return pId === projectId || String(pId) === String(projectId);
            });
            console.log('🌸 Opening modal with index:', index, 'for project:', project.projectName);
            if (index !== -1) {
                setCurrentProjectIndex(index);
                setSelectedProject(projects[index]);
                setHighlightedProjectId(projectId);
            }
        }
    }, [selectedProject, projects]);
    
    const closeProjectModal = () => {
        setSelectedProject(null);
        setHighlightedProjectId(null);
        // Reset drag state so next open positions at top-right again
        hasBeenDragged.current = false;
    };
    
    // Handle grouping mode change
    const handleGroupingChange = useCallback((newMode) => {
        // Close modal when changing grouping mode
        if (selectedProject) {
            closeProjectModal();
        }
        // Update grouping mode
        setGroupingMode(newMode);
    }, [selectedProject]);
    
    // Navigation handlers
    const handlePreviousProject = () => {
        if (currentProjectIndex > 0) {
            const newIndex = currentProjectIndex - 1;
            setCurrentProjectIndex(newIndex);
            setSelectedProject(projects[newIndex]);
            setHighlightedProjectId(projects[newIndex].id || projects[newIndex]._id);
        }
    };
    
    const handleNextProject = () => {
        if (currentProjectIndex < projects.length - 1) {
            const newIndex = currentProjectIndex + 1;
            setCurrentProjectIndex(newIndex);
            setSelectedProject(projects[newIndex]);
            setHighlightedProjectId(projects[newIndex].id || projects[newIndex]._id);
        }
    };
    
    // Drag handlers
    const handleDragStart = (e) => {
        const modal = modalRef.current;
        if (!modal) return;
        
        dragRef.current.isDragging = true;
        
        // Get initial positions
        const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        
        dragRef.current.startX = clientX;
        dragRef.current.startY = clientY;
        
        const rect = modal.getBoundingClientRect();
        dragRef.current.modalStartX = rect.left;
        dragRef.current.modalStartY = rect.top;
        
        // Remove transition during drag
        modal.style.transition = 'none';
        
        document.addEventListener('mousemove', handleDragMove);
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchmove', handleDragMove);
        document.addEventListener('touchend', handleDragEnd);
    };
    
    const handleDragMove = (e) => {
        if (!dragRef.current.isDragging) return;
        
        const modal = modalRef.current;
        if (!modal) return;
        
        const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const clientY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
        
        const deltaX = clientX - dragRef.current.startX;
        const deltaY = clientY - dragRef.current.startY;
        
        const newX = dragRef.current.modalStartX + deltaX;
        const newY = dragRef.current.modalStartY + deltaY;
        
        // Apply position
        modal.style.left = `${newX}px`;
        modal.style.top = `${newY}px`;
        modal.style.right = 'auto';
        modal.style.transform = 'none';
    };
    
    const handleDragEnd = () => {
        if (!dragRef.current.isDragging) return;
        
        dragRef.current.isDragging = false;
        hasBeenDragged.current = true; // User has manually positioned modal
        
        const modal = modalRef.current;
        if (!modal) return;
        
        // Snap to grid (corners/edges)
        const rect = modal.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        const modalWidth = rect.width;
        const modalHeight = rect.height;
        
        let finalX = rect.left;
        let finalY = rect.top;
        
        // Snap to corners/edges with margin
        const snapMargin = 40;
        const snapThreshold = 100; // Distance to trigger snap
        
        // Horizontal snapping
        if (rect.left < snapThreshold) {
            // Snap to left edge
            finalX = snapMargin;
        } else if (rect.right > viewportWidth - snapThreshold) {
            // Snap to right edge
            finalX = viewportWidth - modalWidth - snapMargin;
        }
        
        // Vertical snapping
        if (rect.top < snapThreshold) {
            // Snap to top
            finalY = snapMargin;
        } else if (rect.bottom > viewportHeight - snapThreshold) {
            // Snap to bottom
            finalY = viewportHeight - modalHeight - snapMargin;
        }
        
        // Ensure modal stays within viewport bounds
        finalX = Math.max(snapMargin, Math.min(finalX, viewportWidth - modalWidth - snapMargin));
        finalY = Math.max(snapMargin, Math.min(finalY, viewportHeight - modalHeight - snapMargin));
        
        // Apply snapped position with transition
        modal.style.transition = 'all 0.3s ease';
        modal.style.left = `${finalX}px`;
        modal.style.top = `${finalY}px`;
        
        // Clean up event listeners
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('touchend', handleDragEnd);
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
    
    const handleDeleteProject = async (projectId) => {
        if (!window.confirm('Are you sure you want to remove this project from your garden? This action cannot be undone.')) {
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                // Close modal
                closeProjectModal();
                
                // Update state instead of reloading - keeps scroll position!
                if (onProjectDeleted) {
                    onProjectDeleted(projectId);
                }
            } else {
                alert('Failed to delete project. Please try again.');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('An error occurred while deleting the project.');
        }
    };
    
    const handleAddProjectLink = () => {
        setIsEditingLink(true);
        setEditedLink(selectedProject.projectLink || '');
    };
    
    const handleSaveProjectLink = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/projects/${selectedProject.id}/link`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ projectLink: editedLink })
            });
            
            if (response.ok) {
                // Update local state
                const updatedProject = { ...selectedProject, projectLink: editedLink };
                setSelectedProject(updatedProject);
                setIsEditingLink(false);
                
                // Update projects array
                const updatedProjects = projects.map(p => 
                    p.id === selectedProject.id ? updatedProject : p
                );
                // Note: You might need to pass an update callback from parent
            } else {
                alert('Failed to update project link. Please try again.');
            }
        } catch (error) {
            console.error('Error updating project link:', error);
            alert('An error occurred while updating the project link.');
        }
    };
    
    const handleScreenshotUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setIsUploadingScreenshot(true);
        
        try {
            const formData = new FormData();
            formData.append('screenshot', file);
            
            const response = await fetch(`${API_BASE_URL}/api/projects/${selectedProject.id}/screenshot`, {
                method: 'PATCH',
                body: formData
            });
            
            if (response.ok) {
                const data = await response.json();
                // Update local state
                const updatedProject = { ...selectedProject, screenshot: data.screenshot };
                setSelectedProject(updatedProject);
            } else {
                alert('Failed to upload screenshot. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading screenshot:', error);
            alert('An error occurred while uploading the screenshot.');
        } finally {
            setIsUploadingScreenshot(false);
        }
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
                <h1 className="hero-title">Ideas Garden</h1>
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
                onGroupingChange={handleGroupingChange}
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
            
            {/* Project Modal - Draggable Side Panel */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div 
                        className="project-modal"
                        ref={modalRef}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Drag Handle */}
                        <div 
                            className="modal-drag-handle"
                            onMouseDown={handleDragStart}
                            onTouchStart={handleDragStart}
                        >
                            <div className="drag-handle-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                        
                        {/* Header with Close Button */}
                        <div className="modal-header-top">
                            <button className="modal-close" onClick={closeProjectModal}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        
                        {/* Navigation Arrows */}
                        <div className="modal-navigation">
                            <button 
                                className="nav-arrow nav-arrow-prev"
                                onClick={handlePreviousProject}
                                disabled={currentProjectIndex === 0}
                                title="Previous project (←)"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                </svg>
                            </button>
                            <span className="project-counter">
                                {currentProjectIndex + 1} / {projects.length}
                            </span>
                            <button 
                                className="nav-arrow nav-arrow-next"
                                onClick={handleNextProject}
                                disabled={currentProjectIndex === projects.length - 1}
                                title="Next project (→)"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                </svg>
                            </button>
                        </div>
                        
                        {/* Scrollable Content Area */}
                        <div className="modal-content">
                            <div 
                                key={selectedProject.id || selectedProject._id} 
                                className="modal-content-inner"
                            >
                                {/* Flower Icon */}
                                <div className="modal-flower-icon">
                                    <Fruit 
                                        type={selectedProject.stickerData?.fruitType || 'apple'}
                                        size="large"
                                        animated={false}
                                    />
                                </div>
                                
                                {/* Project Title */}
                                <h2 className="modal-project-title">{selectedProject.projectName}</h2>
                                
                                {/* Project Details */}
                                <div className="modal-project-details">
                                    <div className="detail-item">
                                        <span className="detail-icon">📍</span>
                                        <span className="detail-label">Location:</span>
                                        <span className="detail-value">{selectedProject.location}</span>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-icon">👤</span>
                                        <span className="detail-label">Gardener:</span>
                                        <span className="detail-value">{selectedProject.creator}</span>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-icon">🌱</span>
                                        <span className="detail-label">Planted:</span>
                                        <span className="detail-value">{new Date(selectedProject.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-icon">❤️</span>
                                        <span className="detail-label">Likes:</span>
                                        <span className="detail-value">{selectedProject.likes || 0}</span>
                                    </div>
                                </div>
                                
                                {/* Screenshot or Upload Area */}
                                {selectedProject.screenshot ? (
                                    <div className="modal-screenshot">
                                        <img 
                                            src={`${API_BASE_URL}${selectedProject.screenshot}`} 
                                            alt={selectedProject.projectName}
                                        />
                                    </div>
                                ) : (
                                    <div className="modal-screenshot-upload">
                                        <label htmlFor="screenshot-upload" className="screenshot-upload-label">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                <polyline points="21 15 16 10 5 21"></polyline>
                                            </svg>
                                            <p>{isUploadingScreenshot ? 'Uploading...' : 'Add project screenshot'}</p>
                                            <span>Click to upload image</span>
                                        </label>
                                        <input
                                            id="screenshot-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleScreenshotUpload}
                                            style={{ display: 'none' }}
                                            disabled={isUploadingScreenshot}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Sticky Action Buttons */}
                        <div className="modal-actions">
                            <button 
                                className="action-btn action-btn-like"
                                onClick={(e) => handleLikeProject(e, selectedProject.id)}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                                <span>Water with Love</span>
                            </button>
                            
                            {selectedProject.projectLink ? (
                                <a 
                                    href={selectedProject.projectLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="action-btn action-btn-visit"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                        <polyline points="15 3 21 3 21 9"></polyline>
                                        <line x1="10" y1="14" x2="21" y2="3"></line>
                                    </svg>
                                    <span>Visit Project</span>
                                </a>
                            ) : (
                                <button 
                                    className="action-btn action-btn-add-link"
                                    onClick={handleAddProjectLink}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                    </svg>
                                    <span>Add Project Link</span>
                                </button>
                            )}
                            
                            <button 
                                className="action-btn action-btn-delete"
                                onClick={() => handleDeleteProject(selectedProject.id)}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                                <span>Delete</span>
                            </button>
                        </div>
                        
                        {/* Edit Link Modal */}
                        {isEditingLink && (
                            <div className="modal-edit-overlay" onClick={() => setIsEditingLink(false)}>
                                <div className="modal-edit-dialog" onClick={(e) => e.stopPropagation()}>
                                    <h3>Add Project Link</h3>
                                    <input
                                        type="url"
                                        value={editedLink}
                                        onChange={(e) => setEditedLink(e.target.value)}
                                        placeholder="https://example.com"
                                        className="modal-edit-input"
                                        autoFocus
                                    />
                                    <div className="modal-edit-actions">
                                        <button onClick={() => setIsEditingLink(false)} className="modal-edit-cancel">
                                            Cancel
                                        </button>
                                        <button onClick={handleSaveProjectLink} className="modal-edit-save">
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Garden;