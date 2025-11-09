// client/src/components/FlowerField.js
// Interactive flower layout using D3 force simulation with drag-and-release functionality

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../styles/FlowerField.css';

const FlowerField = ({ projects = [], onFlowerClick, groupingMode = 'projectType', onGroupingChange, highlightedProjectId = null }) => {
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const simulationRef = useRef(null);
    const dimensionsRef = useRef({ width: 1200, height: 450 });
    const isDraggingRef = useRef(false);
    const flowersDataRef = useRef([]);
    const isInitialMount = useRef(true);

    // Function to calculate cluster centers based on grouping mode
    const calculateClusterCenters = (flowers, mode, width) => {
        const extendedWidth = width * 1.5;
        
        if (mode === 'projectType') {
            // Group by adjective (shape) - same shape clusters together
            const uniqueTypes = [...new Set(flowers.filter(f => f.isProject).map(f => f.projectAdjective))].filter(Boolean);
            if (uniqueTypes.length === 0) return [{ x: extendedWidth * 0.5, weight: 1.0 }];
            
            return uniqueTypes.map((type, i) => ({
                key: type,
                x: extendedWidth * ((i + 1) / (uniqueTypes.length + 1)),
                weight: 1.0
            }));
        } else if (mode === 'geolocation') {
            // Group by location - same location clusters together
            const uniqueLocations = [...new Set(flowers.filter(f => f.isProject).map(f => f.project?.location))].filter(Boolean);
            if (uniqueLocations.length === 0) return [{ x: extendedWidth * 0.5, weight: 1.0 }];
            
            return uniqueLocations.map((location, i) => ({
                key: location,
                x: extendedWidth * ((i + 1) / (uniqueLocations.length + 1)),
                weight: 1.0
            }));
        } else if (mode === 'projectEmotions') {
            // Group by feeling (color) - same feeling clusters together
            const uniqueEmotions = [...new Set(flowers.filter(f => f.isProject).map(f => f.projectFeeling))].filter(Boolean);
            if (uniqueEmotions.length === 0) return [{ x: extendedWidth * 0.5, weight: 1.0 }];
            
            return uniqueEmotions.map((emotion, i) => ({
                key: emotion,
                x: extendedWidth * ((i + 1) / (uniqueEmotions.length + 1)),
                weight: 1.0
            }));
        }
        
        // Default fallback
        return [
            { x: extendedWidth * 0.2, weight: 0.7 },
            { x: extendedWidth * 0.4, weight: 0.9 },
            { x: extendedWidth * 0.6, weight: 1.0 },
            { x: extendedWidth * 0.8, weight: 0.9 },
            { x: extendedWidth * 1.0, weight: 0.7 }
        ];
    };
    
    // Function to assign flowers to clusters based on grouping mode
    const assignFlowersToClusters = (flowers, clusterCenters, mode) => {
        return flowers.map((flower, i) => {
            let clusterIndex = 0;
            
            if (flower.isProject && clusterCenters.length > 0) {
                if (mode === 'projectType') {
                    const typeIndex = clusterCenters.findIndex(c => c.key === flower.projectAdjective);
                    clusterIndex = typeIndex >= 0 ? typeIndex : Math.floor(Math.random() * clusterCenters.length);
                } else if (mode === 'geolocation') {
                    const locationIndex = clusterCenters.findIndex(c => c.key === flower.project?.location);
                    clusterIndex = locationIndex >= 0 ? locationIndex : Math.floor(Math.random() * clusterCenters.length);
                } else if (mode === 'projectEmotions') {
                    const emotionIndex = clusterCenters.findIndex(c => c.key === flower.projectFeeling);
                    clusterIndex = emotionIndex >= 0 ? emotionIndex : Math.floor(Math.random() * clusterCenters.length);
                }
            } else {
                // Decorative flowers distributed evenly
                clusterIndex = i % clusterCenters.length;
            }
            
            return {
                ...flower,
                cluster: clusterIndex,
                clusterX: clusterCenters[clusterIndex].x
            };
        });
    };

    useEffect(() => {
        if (!containerRef.current || !svgRef.current) return;

        // Update dimensions based on container
        const updateDimensions = () => {
            if (containerRef.current) {
                // Container is 150% of viewport width for horizontal overflow
                const width = containerRef.current.offsetWidth;
                const height = 450;
                dimensionsRef.current = { width, height };
                
                // Update SVG dimensions to match container
                d3.select(svgRef.current)
                    .attr('width', width)
                    .attr('height', height);
            }
        };

        updateDimensions();
        
        // Combine project flowers (large, clickable) with decorative flowers (small, background)
        const projectFlowers = projects.map((project, i) => ({
            id: `project-${project.id || i}`,
            shape: project.stickerData?.fruitType?.replace('shape', '') || (i % 15) + 1,
            size: 'large',
            radius: 75, // Larger for visibility and clickability
            rotation: (i * 17 - 10) % 360,
            opacity: 0.98,
            responsive: false,
            isProject: true,
            project: project,
            projectAdjective: project.projectAdjective || null,
            projectFeeling: project.projectFeeling || null
        }));
        
        // Decorative background flowers
        const decorativeFlowers = [
            { id: 'dec-1', shape: 15, size: 'small', radius: 50, rotation: 8, opacity: 0.85, responsive: 'hide-mobile', isProject: false },
            { id: 'dec-2', shape: 1, size: 'small', radius: 50, rotation: -12, opacity: 0.85, responsive: 'hide-mobile', isProject: false },
            { id: 'dec-3', shape: 3, size: 'small', radius: 50, rotation: 16, opacity: 0.8, responsive: 'hide-tablet', isProject: false },
            { id: 'dec-4', shape: 5, size: 'small', radius: 50, rotation: -9, opacity: 0.8, responsive: 'hide-tablet', isProject: false },
            { id: 'dec-5', shape: 7, size: 'small', radius: 50, rotation: 14, opacity: 0.85, responsive: 'hide-mobile', isProject: false },
            { id: 'dec-6', shape: 9, size: 'small', radius: 50, rotation: -11, opacity: 0.8, responsive: 'hide-tablet', isProject: false },
            { id: 'dec-7', shape: 11, size: 'small', radius: 50, rotation: 18, opacity: 0.82, responsive: 'hide-mobile', isProject: false },
            { id: 'dec-8', shape: 13, size: 'small', radius: 50, rotation: -15, opacity: 0.78, responsive: 'hide-tablet', isProject: false },
        ];
        
        const initialFlowers = [...projectFlowers, ...decorativeFlowers];

        const { width, height } = dimensionsRef.current;

        // Calculate cluster centers based on current grouping mode
        const clusterCenters = calculateClusterCenters(initialFlowers, groupingMode, width);

        // Assign each flower to a cluster based on grouping mode
        const flowersWithClusters = assignFlowersToClusters(initialFlowers, clusterCenters, groupingMode);
        
        // Store flowers data for later updates
        flowersDataRef.current = flowersWithClusters;

        // Create D3 force simulation with bounds to prevent vertical cutoff
        const simulation = d3.forceSimulation(flowersWithClusters)
            .force('x', d3.forceX(d => d.clusterX).strength(0.3))
            // Keep within vertical bounds: min 80px from top, max 80px from bottom
            .force('y', d3.forceY(height - 100).strength(0.6))
            .force('collide', d3.forceCollide(d => d.radius).strength(0.7))
            .force('charge', d3.forceManyBody().strength(5).distanceMax(200))
            // Add bounds force to keep flowers visible vertically
            .force('bounds', () => {
                flowersWithClusters.forEach(d => {
                    const buffer = d.radius;
                    d.y = Math.max(buffer + 60, Math.min(height - buffer - 20, d.y));
                });
            })
            .stop();

        // Run initial simulation
        for (let i = 0; i < 300; ++i) simulation.tick();

        // Store original positions for spring-back behavior
        flowersWithClusters.forEach(flower => {
            flower.originalX = flower.x;
            flower.originalY = flower.y;
        });

        simulationRef.current = simulation;

        // Select SVG container
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear previous content

        // Get size dimensions for each flower type
        const getSizeClass = (size) => {
            switch(size) {
                case 'large': return { width: 140, height: 140 };
                case 'medium': return { width: 110, height: 110 };
                case 'small': return { width: 90, height: 90 };
                default: return { width: 110, height: 110 };
            }
        };

        // Create flower groups
        const flowerGroups = svg.selectAll('g.flower-group')
            .data(flowersWithClusters, d => d.id)
            .join('g')
            .attr('class', d => `flower-group flower-${d.size} ${d.responsive || ''} ${d.isProject ? 'project-flower' : 'decorative-flower'}`)
            .attr('transform', d => `translate(${d.x}, ${d.y})`)
            .style('cursor', 'grab');

        // Add flower images
        flowerGroups.each(function(d) {
            const group = d3.select(this);
            const { width: w, height: h } = getSizeClass(d.size);
            
            group.append('image')
                .attr('href', `/shapes/Shape ${d.shape}.svg`)
                .attr('width', w)
                .attr('height', h)
                .attr('x', -w / 2)
                .attr('y', -h / 2)
                .attr('transform', `rotate(${d.rotation})`)
                .style('opacity', d.opacity)
                .style('filter', 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15))');
            
            // Add label for project flowers
            if (d.isProject && d.project) {
                const labelGroup = group.append('g')
                    .attr('class', 'flower-label-group')
                    .style('opacity', 0)
                    .style('pointer-events', 'none');
                
                labelGroup.append('rect')
                    .attr('x', -60)
                    .attr('y', h / 2 + 10)
                    .attr('width', 120)
                    .attr('height', 35)
                    .attr('rx', 17.5)
                    .style('fill', 'rgba(255, 255, 255, 0.95)')
                    .style('filter', 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15))');
                
                labelGroup.append('text')
                    .attr('y', h / 2 + 32)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '14px')
                    .style('font-weight', '600')
                    .style('fill', '#333')
                    .text(d.project.projectName || 'Project');
            }
        });

        // Track drag vs click
        let dragStartPos = null;
        let wasDragged = false;

        // Drag behavior with click detection
        const drag = d3.drag()
            .on('start', function(event, d) {
                isDraggingRef.current = false;
                wasDragged = false;
                dragStartPos = { x: event.x, y: event.y };
                
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
                d3.select(this).style('cursor', 'grabbing');
                d3.select(this).raise(); // Bring to front
                
                // Show label on hover for project flowers
                d3.select(this).select('.flower-label-group')
                    .transition()
                    .duration(200)
                    .style('opacity', 1);
            })
            .on('drag', function(event, d) {
                // Calculate drag distance
                const dx = event.x - dragStartPos.x;
                const dy = event.y - dragStartPos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // If moved more than 5px, it's a drag
                if (distance > 5) {
                    isDraggingRef.current = true;
                    wasDragged = true;
                }
                
                // Keep within vertical bounds while dragging
                const buffer = d.radius;
                d.fx = event.x;
                d.fy = Math.max(buffer + 60, Math.min(height - buffer - 20, event.y));
            })
            .on('end', function(event, d) {
                if (!event.active) simulation.alphaTarget(0);
                
                // Spring back to original position
                d.fx = d.originalX;
                d.fy = d.originalY;
                
                // Animate spring-back
                simulation.alphaTarget(0.3).restart();
                
                // Release fixed position after animation
                setTimeout(() => {
                    d.fx = null;
                    d.fy = null;
                    simulation.alphaTarget(0);
                    isDraggingRef.current = false;
                }, 1000);
                
                d3.select(this).style('cursor', 'grab');
                
                // Hide label
                d3.select(this).select('.flower-label-group')
                    .transition()
                    .duration(200)
                    .style('opacity', 0);
                
                // If it was a click (not dragged) and is a project flower, open modal
                if (!wasDragged && d.isProject && d.project && onFlowerClick) {
                    setTimeout(() => {
                        if (!isDraggingRef.current) {
                            onFlowerClick(d.project);
                        }
                    }, 100);
                }
            });

        // Apply drag behavior to flower groups
        flowerGroups.call(drag);
        
        // Add hover effects for project flowers
        flowerGroups.filter(d => d.isProject)
            .on('mouseenter', function() {
                if (!isDraggingRef.current) {
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('transform', function(d) {
                            return `translate(${d.x}, ${d.y}) scale(1.1)`;
                        });
                    
                    d3.select(this).select('.flower-label-group')
                        .transition()
                        .duration(200)
                        .style('opacity', 1);
                }
            })
            .on('mouseleave', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('transform', function(d) {
                        return `translate(${d.x}, ${d.y}) scale(1)`;
                    });
                
                d3.select(this).select('.flower-label-group')
                    .transition()
                    .duration(200)
                    .style('opacity', 0);
            });

        // Update positions on simulation tick
        simulation.on('tick', () => {
            flowerGroups.attr('transform', d => `translate(${d.x}, ${d.y})`);
        });

        // Restart simulation for interactive updates
        simulation.restart();

        // Handle window resize
        const handleResize = () => {
            updateDimensions();
            const { width: newWidth, height: newHeight } = dimensionsRef.current;
            
            if (flowersDataRef.current.length === 0) return;
            
            // Recalculate cluster centers for new width
            const newClusterCenters = calculateClusterCenters(flowersDataRef.current, groupingMode, newWidth);
            
            // Reassign flowers to clusters with new positions
            const updatedFlowers = assignFlowersToClusters(flowersDataRef.current, newClusterCenters, groupingMode);
            flowersDataRef.current = updatedFlowers;
            
            // Update simulation forces
            simulation.nodes(updatedFlowers);
            simulation
                .force('x', d3.forceX(d => d.clusterX).strength(0.3))
                .force('y', d3.forceY(newHeight - 80).strength(0.5))
                .alpha(0.3)
                .restart();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (simulationRef.current) {
                simulationRef.current.stop();
            }
        };
    }, [projects, onFlowerClick, groupingMode]);
    
    // Separate useEffect to handle grouping mode changes with smooth transitions
    useEffect(() => {
        // Skip on initial mount - let the main useEffect handle initial setup
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        
        if (!simulationRef.current || !svgRef.current || flowersDataRef.current.length === 0) return;
        
        const { width, height } = dimensionsRef.current;
        const flowers = flowersDataRef.current;
        
        // Calculate new cluster centers based on grouping mode
        const newClusterCenters = calculateClusterCenters(flowers, groupingMode, width);
        
        // Reassign flowers to new clusters
        const updatedFlowers = assignFlowersToClusters(flowers, newClusterCenters, groupingMode);
        
        // Preserve existing position and velocity data
        updatedFlowers.forEach((flower, i) => {
            const oldFlower = flowers[i];
            if (oldFlower && typeof oldFlower.x !== 'undefined') {
                flower.x = oldFlower.x;
                flower.y = oldFlower.y;
                flower.vx = oldFlower.vx || 0;
                flower.vy = oldFlower.vy || 0;
            }
        });
        
        // Update the flowers data
        flowersDataRef.current = updatedFlowers;
        
        // Update D3 simulation forces (don't recreate, just update)
        const simulation = simulationRef.current;
        simulation.nodes(updatedFlowers);
        
        // Update forceX to use new cluster centers
        simulation.force('x', d3.forceX(d => d.clusterX).strength(0.3));
        
        // Animate transition to new positions
        simulation.alpha(1).restart();
        
        // Update SVG elements with smooth transitions
        const svg = d3.select(svgRef.current);
        const flowerGroups = svg.selectAll('g.flower-group')
            .data(updatedFlowers, d => d.id);
        
        // After animation completes, update original positions for spring-back
        setTimeout(() => {
            updatedFlowers.forEach(flower => {
                if (typeof flower.x !== 'undefined') {
                    flower.originalX = flower.x;
                    flower.originalY = flower.y;
                }
            });
        }, 1500);
        
    }, [groupingMode]);

    // Handle highlighting of specific flower when navigating from Shelf
    useEffect(() => {
        if (!highlightedProjectId || !svgRef.current) return;
        
        const svg = d3.select(svgRef.current);
        
        // Helper function to get size dimensions
        const getSizeClass = (size) => {
            switch(size) {
                case 'large': return { width: 140, height: 140 };
                case 'medium': return { width: 110, height: 110 };
                case 'small': return { width: 90, height: 90 };
                default: return { width: 110, height: 110 };
            }
        };
        
        // Remove any existing highlights
        svg.selectAll('.flower-group').classed('highlighted', false);
        svg.selectAll('.highlight-ring').remove();
        
        // Find the source project to get its name for additional matching
        const sourceProject = projects.find(p => (p.id || p._id) === highlightedProjectId);
        console.log('🌟 HIGHLIGHT: Source project found:', sourceProject?.projectName);
        
        // Find and highlight the specific flower
        const flowerGroup = svg.selectAll('.flower-group')
            .filter(d => {
                if (!d.isProject || !d.project) return false;
                
                // Check both id and _id properties
                const projectId = d.project.id || d.project._id;
                
                // Try multiple comparison methods for maximum compatibility
                const isMatch = (
                    projectId === highlightedProjectId || 
                    String(projectId) === String(highlightedProjectId) || 
                    Number(projectId) === Number(highlightedProjectId) ||
                    (d.project.id && d.project.id === highlightedProjectId) ||
                    (d.project._id && d.project._id === highlightedProjectId) ||
                    // Also try matching by project name as fallback
                    (sourceProject && d.project.projectName === sourceProject.projectName)
                );
                
                if (isMatch) {
                    console.log('🌟 HIGHLIGHT: ✅ MATCH FOUND for project:', d.project.projectName);
                }
                
                return isMatch;
            });
        
        if (!flowerGroup.empty()) {
            // Add highlight class
            flowerGroup.classed('highlighted', true);
            
            // Add pulsing ring effect
            const flowerData = flowerGroup.datum();
            const { width: w, height: h } = getSizeClass(flowerData.size);
            const radius = Math.max(w, h) / 2 + 15;
            
            flowerGroup.insert('circle', ':first-child')
                .attr('class', 'highlight-ring')
                .attr('r', radius)
                .attr('fill', 'none')
                .attr('stroke', '#FFD700')
                .attr('stroke-width', 4)
                .attr('opacity', 0)
                .transition()
                .duration(600)
                .attr('opacity', 1)
                .attr('stroke-width', 6)
                .transition()
                .duration(600)
                .attr('opacity', 0)
                .attr('stroke-width', 4)
                .on('end', function repeat() {
                    d3.select(this)
                        .transition()
                        .duration(600)
                        .attr('opacity', 1)
                        .attr('stroke-width', 6)
                        .transition()
                        .duration(600)
                        .attr('opacity', 0)
                        .attr('stroke-width', 4)
                        .on('end', repeat);
                });
        }
        
        // Clean up when highlight is removed
        return () => {
            svg.selectAll('.flower-group').classed('highlighted', false);
            svg.selectAll('.highlight-ring').remove();
        };
    }, [highlightedProjectId]);

    return (
        <div className="flower-field-container">
            {/* Grouping Toggle UI - Neobrutalism Radio Style */}
            <div className="flower-grouping-toggle">
                <div className="toggle-wrapper">
                    <div className="toggle-option">
                        <input 
                            checked={groupingMode === 'projectType'}
                            value="projectType" 
                            name="flower-sort" 
                            type="radio" 
                            className="toggle-input"
                            onChange={() => onGroupingChange && onGroupingChange('projectType')}
                            title="Group by Project Type (shape)"
                        />
                        <div className="toggle-btn">
                            <span className="toggle-span">🎨 Project Type</span>
                        </div>
                    </div>
                    
                    <div className="toggle-option">
                        <input 
                            checked={groupingMode === 'geolocation'}
                            value="geolocation" 
                            name="flower-sort" 
                            type="radio" 
                            className="toggle-input"
                            onChange={() => onGroupingChange && onGroupingChange('geolocation')}
                            title="Group by Geolocation"
                        />
                        <div className="toggle-btn">
                            <span className="toggle-span">🌍 Geolocation</span>
                        </div>
                    </div>
                    
                    <div className="toggle-option">
                        <input 
                            checked={groupingMode === 'projectEmotions'}
                            value="projectEmotions" 
                            name="flower-sort" 
                            type="radio" 
                            className="toggle-input"
                            onChange={() => onGroupingChange && onGroupingChange('projectEmotions')}
                            title="Group by Project Emotions (color)"
                        />
                        <div className="toggle-btn">
                            <span className="toggle-span">💭 Project Emotions</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Flower Field */}
            <div className="flower-field" ref={containerRef}>
                <svg 
                    ref={svgRef} 
                    className="flower-field-svg"
                    style={{ 
                        width: '100%', 
                        height: '100%',
                        pointerEvents: 'all'
                    }}
                />
            </div>
        </div>
    );
};

export default FlowerField;

