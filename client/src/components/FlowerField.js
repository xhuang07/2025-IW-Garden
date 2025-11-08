// client/src/components/FlowerField.js
// Interactive flower layout using D3 force simulation with drag-and-release functionality

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../styles/FlowerField.css';

const FlowerField = ({ projects = [], onFlowerClick }) => {
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const simulationRef = useRef(null);
    const dimensionsRef = useRef({ width: 1200, height: 450 });
    const isDraggingRef = useRef(false);

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
            project: project
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

        // Define cluster centers - allow wider distribution (up to 1.5x viewport width for horizontal overflow)
        const extendedWidth = width * 1.5;
        const clusterCenters = [
            { x: extendedWidth * 0.2, weight: 0.7 },   // Left cluster
            { x: extendedWidth * 0.4, weight: 0.9 },   // Left-center
            { x: extendedWidth * 0.6, weight: 1.0 },   // Center cluster (densest)
            { x: extendedWidth * 0.8, weight: 0.9 },   // Right-center
            { x: extendedWidth * 1.0, weight: 0.7 },   // Right cluster
        ];

        // Assign each flower to a cluster
        const flowersWithClusters = initialFlowers.map((flower, i) => {
            const clusterIndex = i % clusterCenters.length;
            return {
                ...flower,
                cluster: clusterIndex,
                clusterX: clusterCenters[clusterIndex].x,
            };
        });

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
            
            // Update cluster centers
            clusterCenters[0].x = newWidth * 0.25;
            clusterCenters[1].x = newWidth * 0.5;
            clusterCenters[2].x = newWidth * 0.75;
            
            // Update simulation forces
            simulation
                .force('x', d3.forceX(d => clusterCenters[d.cluster].x).strength(0.3))
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
    }, [projects, onFlowerClick]);

    return (
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
    );
};

export default FlowerField;

