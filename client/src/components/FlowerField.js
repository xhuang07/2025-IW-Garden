// client/src/components/FlowerField.js
// Interactive flower layout using D3 force simulation with drag-and-release functionality

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import '../styles/FlowerField.css';

const FlowerField = ({ projects = [], onFlowerClick, groupingMode = 'all', onGroupingChange, highlightedProjectId = null }) => {
    const containerRef = useRef(null);
    const svgRef = useRef(null);
    const simulationRef = useRef(null);
    const dimensionsRef = useRef({ width: 1200, height: 450 });
    const isDraggingRef = useRef(false);
    const flowersDataRef = useRef([]);
    const isInitialMount = useRef(true);
    
    // Helper function to render cluster labels
    const renderClusterLabelsForMode = (svg, flowers, mode) => {
        if (mode !== 'projectType' && mode !== 'projectEmotions') {
            svg.selectAll('.cluster-label-group').remove();
            return;
        }
        
        // Responsive sizing based on viewport
        const viewportWidth = window.innerWidth;
        let containerHeight, circleSize, fontSize, padding, gap;
        
        if (viewportWidth < 768) {
            // Mobile
            containerHeight = 34;
            circleSize = 24;
            fontSize = 12;
            padding = { top: 5, right: 8, bottom: 5, left: 5 };
            gap = 5;
        } else if (viewportWidth < 1024) {
            // Tablet
            containerHeight = 38;
            circleSize = 26;
            fontSize = 14;
            padding = { top: 6, right: 10, bottom: 6, left: 6 };
            gap = 6;
        } else {
            // Desktop
            containerHeight = 44;
            circleSize = 28;
            fontSize = 16;
            padding = { top: 8, right: 12, bottom: 8, left: 8 };
            gap = 8;
        }
        
        // Group flowers by project type or emotion
        const clusters = {};
        const groupByField = mode === 'projectType' ? 'projectAdjective' : 'projectFeeling';
        
        flowers.forEach(flower => {
            if (!flower.isProject) return;
            
            const groupValue = flower[groupByField];
            if (!groupValue) return;
            
            if (!clusters[groupValue]) {
                clusters[groupValue] = {
                    flowers: [],
                    minY: Infinity,
                    sumX: 0,
                    sumY: 0
                };
            }
            clusters[groupValue].flowers.push(flower);
            clusters[groupValue].minY = Math.min(clusters[groupValue].minY, flower.y || 0);
            clusters[groupValue].sumX += flower.x || 0;
            clusters[groupValue].sumY += flower.y || 0;
        });
        
        // Calculate cluster centers
        const clusterData = Object.entries(clusters).map(([groupValue, data]) => {
            const avgX = data.sumX / data.flowers.length;
            const avgY = data.minY - 120;
            
            return {
                type: groupValue, // Label text - shows type or emotion
                x: avgX,
                y: Math.max(80, avgY),
                count: data.flowers.length
            };
        });
        
        // Render labels with new design
        svg.selectAll('.cluster-label-group')
            .data(clusterData, d => d.type)
            .join(
                enter => {
                    const group = enter.append('g')
                        .attr('class', 'cluster-label-group')
                        .attr('transform', d => `translate(${d.x}, ${d.y})`)
                        .style('opacity', 0);
                    
                    // Measure text first to calculate container width
                    const tempText = group.append('text')
                        .style('font-size', `${fontSize}px`)
                        .style('font-weight', '700')
                        .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif')
                        .text(d => d.type);
                    
                    group.each(function(d) {
                        const g = d3.select(this);
                        const textNode = g.select('text').node();
                        const textWidth = textNode.getBBox().width;
                        
                        // Calculate container width: padding + circle + gap + text + padding
                        const containerWidth = padding.left + circleSize + gap + textWidth + padding.right;
                        
                        // Remove temp text
                        g.select('text').remove();
                        
                        // Add outer container background (light blue rounded pill)
                        g.append('rect')
                            .attr('class', 'cluster-label-container')
                            .attr('x', -containerWidth / 2)
                            .attr('y', -containerHeight / 2)
                            .attr('width', containerWidth)
                            .attr('height', containerHeight)
                            .attr('rx', containerHeight / 2) // Fully rounded (100px border-radius effect)
                            .style('fill', '#B7E7FC')
                            .style('stroke', 'none');
                        
                        // Calculate positions for inner elements
                        const startX = -containerWidth / 2 + padding.left;
                        const centerY = 0;
                        
                        // Add count circle
                        g.append('circle')
                            .attr('class', 'cluster-label-count-circle')
                            .attr('cx', startX + circleSize / 2)
                            .attr('cy', centerY)
                            .attr('r', circleSize / 2)
                            .style('fill', '#B7E7FC')
                            .style('stroke', '#000000')
                            .style('stroke-width', '1px');
                        
                        // Add count number
                        g.append('text')
                            .attr('class', 'cluster-count-number')
                            .attr('x', startX + circleSize / 2)
                            .attr('y', centerY)
                            .attr('text-anchor', 'middle')
                            .attr('dominant-baseline', 'central')
                            .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif')
                            .style('font-size', `${fontSize}px`)
                            .style('font-weight', '400')
                            .style('fill', '#000000')
                            .text(d.count);
                        
                        // Add type label text
                        g.append('text')
                            .attr('class', 'cluster-type-text')
                            .attr('x', startX + circleSize + gap)
                            .attr('y', centerY)
                            .attr('text-anchor', 'start')
                            .attr('dominant-baseline', 'central')
                            .style('font-family', 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif')
                            .style('font-size', `${fontSize}px`)
                            .style('font-weight', '700')
                            .style('fill', '#000000')
                            .text(d.type);
                    });
                    
                    // Fade in
                    group.transition()
                        .duration(500)
                        .style('opacity', 1);
                    
                    return group;
                },
                update => {
                    update.transition()
                        .duration(500)
                        .attr('transform', d => `translate(${d.x}, ${d.y})`);
                    
                    // Update count and text
                    update.select('.cluster-count-number')
                        .text(d => d.count);
                    
                    update.select('.cluster-type-text')
                        .text(d => d.type);
                    
                    return update;
                },
                exit => {
                    exit.transition()
                        .duration(300)
                        .style('opacity', 0)
                        .remove();
                }
            );
    };

    // Function to calculate cluster centers based on grouping mode
    const calculateClusterCenters = (flowers, mode, width) => {
        const extendedWidth = width * 1.5;
        
        // "All" mode - create clustered pile arrangement
        if (mode === 'all') {
            const totalFlowers = flowers.length;
            
            // Responsive clustering parameters based on viewport width
            const viewportWidth = window.innerWidth;
            let clusteringParams;
            if (viewportWidth < 768) {
                // Mobile: tighter clustering
                clusteringParams = {
                    horizontalSpread: 80,
                    verticalSpread: 140,
                    widthPerFlower: 50
                };
            } else if (viewportWidth < 1024) {
                // Tablet: medium clustering
                clusteringParams = {
                    horizontalSpread: 120,
                    verticalSpread: 160,
                    widthPerFlower: 60
                };
            } else {
                // Desktop: looser clustering
                clusteringParams = {
                    horizontalSpread: 150,
                    verticalSpread: 180,
                    widthPerFlower: 70
                };
            }
            
            // Dynamic width based on number of flowers
            const calculatedWidth = totalFlowers * clusteringParams.widthPerFlower;
            const wideWidth = Math.max(1200, calculatedWidth);
            
            return flowers.map((flower, i) => ({
                key: `flower-${i}`,
                x: (i / (totalFlowers || 1)) * wideWidth,
                // Add random horizontal offset for clustering
                horizontalJitter: (Math.random() - 0.5) * clusteringParams.horizontalSpread,
                // Add random vertical offset for pile effect
                verticalJitter: (Math.random() - 0.5) * clusteringParams.verticalSpread,
                layer: Math.floor(Math.random() * 4), // 4 depth layers
                weight: 0.2 // Weaker force for natural spread
            }));
        } else if (mode === 'projectType') {
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
            
            // "All" mode - each flower gets its own position with clustering data
            if (mode === 'all') {
                clusterIndex = i;
                const clusterData = clusterCenters[i];
                return {
                    ...flower,
                    cluster: clusterIndex,
                    clusterX: clusterData.x + clusterData.horizontalJitter,
                    verticalOffset: clusterData.verticalJitter,
                    layer: clusterData.layer
                };
            } else if (flower.isProject && clusterCenters.length > 0) {
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
        
        // Calculate dynamic width for "All" mode
        let containerWidth = dimensionsRef.current.width;
        if (groupingMode === 'all') {
            const totalFlowers = projects.length + 8; // Projects + decorative flowers
            const viewportWidth = window.innerWidth;
            const widthPerFlower = viewportWidth < 768 ? 50 : viewportWidth < 1024 ? 60 : 70;
            const calculatedWidth = totalFlowers * widthPerFlower;
            containerWidth = Math.max(viewportWidth * 1.5, calculatedWidth);
            
            // Update SVG width for "All" mode
            d3.select(svgRef.current)
                .attr('width', containerWidth);
        }
        
        // Map project adjectives to consistent shapes
        const getShapeForAdjective = (adjective) => {
            const adjectiveToShapeMap = {
                'Revolutionary': '1',
                'Innovative': '2',
                'Disruptive': '3',
                'Fresh': '4',
                'Bold': '5',
                'Crispy': '6',
                'Juicy': '7',
                'Ripe': '8',
                'Organic': '9',
                'Sustainable': '10',
                'Electric': '11',
                'Magnetic': '12',
                'Quantum': '13',
                'Neural': '14',
                'Atomic': '15'
            };
            
            return adjectiveToShapeMap[adjective] || null;
        };
        
        // Reverse map: shape to adjective (for fixing old data)
        const getAdjectiveForShape = (shapeNum) => {
            const shapeToAdjectiveMap = {
                '1': 'Revolutionary',
                '2': 'Innovative',
                '3': 'Disruptive',
                '4': 'Fresh',
                '5': 'Bold',
                '6': 'Crispy',
                '7': 'Juicy',
                '8': 'Ripe',
                '9': 'Organic',
                '10': 'Sustainable',
                '11': 'Electric',
                '12': 'Magnetic',
                '13': 'Quantum',
                '14': 'Neural',
                '15': 'Atomic'
            };
            return shapeToAdjectiveMap[String(shapeNum)] || null;
        };
        
        // Combine project flowers (large, clickable) with decorative flowers (small, background)
        const projectFlowers = projects.map((project, i) => {
            let projectAdjective = project.projectAdjective;
            let shapeNumber;
            
            // CRITICAL: Always derive shape from adjective, NEVER from stored data
            // This ensures all projects with same adjective have same shape
            
            if (projectAdjective) {
                // Use adjective-to-shape mapping
                shapeNumber = getShapeForAdjective(projectAdjective);
                
                if (shapeNumber) {
                    console.log(`✅ Project "${project.projectName}": ${projectAdjective} → shape${shapeNumber}`);
                } else {
                    console.warn(`⚠️ Unknown adjective "${projectAdjective}" for project "${project.projectName}", using shape1`);
                    shapeNumber = '1';
                }
            } else if (project.stickerData?.fruitType) {
                // Old project without adjective - infer from stored shape
                const storedShape = project.stickerData.fruitType.replace('shape', '');
                projectAdjective = getAdjectiveForShape(storedShape) || 'Revolutionary';
                shapeNumber = getShapeForAdjective(projectAdjective) || storedShape;
                
                console.log(`🔄 Project "${project.projectName}" missing adjective, inferred "${projectAdjective}" (shape${shapeNumber})`);
            } else {
                // No data at all - default
                projectAdjective = 'Revolutionary';
                shapeNumber = '1';
                console.warn(`⚠️ Project "${project.projectName}" has no data, defaulting to Revolutionary/shape1`);
            }
            
            return {
                id: `project-${project.id || i}`,
                shape: shapeNumber,
                size: 'large',
                radius: 100,
                rotation: (i * 17 - 10) % 360,
                opacity: 0.98,
                responsive: false,
                isProject: true,
                project: project,
                projectAdjective: projectAdjective,
                projectFeeling: project.projectFeeling || null
            };
        });
        
        // Decorative background flowers
        const decorativeFlowers = [
            { id: 'dec-1', shape: 15, size: 'small', radius: 75, rotation: 8, opacity: 0.85, responsive: 'hide-mobile', isProject: false },
            { id: 'dec-2', shape: 1, size: 'small', radius: 75, rotation: -12, opacity: 0.85, responsive: 'hide-mobile', isProject: false },
            { id: 'dec-3', shape: 3, size: 'small', radius: 75, rotation: 16, opacity: 0.8, responsive: 'hide-tablet', isProject: false },
            { id: 'dec-4', shape: 5, size: 'small', radius: 75, rotation: -9, opacity: 0.8, responsive: 'hide-tablet', isProject: false },
            { id: 'dec-5', shape: 7, size: 'small', radius: 75, rotation: 14, opacity: 0.85, responsive: 'hide-mobile', isProject: false },
            { id: 'dec-6', shape: 9, size: 'small', radius: 75, rotation: -11, opacity: 0.8, responsive: 'hide-tablet', isProject: false },
            { id: 'dec-7', shape: 11, size: 'small', radius: 75, rotation: 18, opacity: 0.82, responsive: 'hide-mobile', isProject: false },
            { id: 'dec-8', shape: 13, size: 'small', radius: 75, rotation: -15, opacity: 0.78, responsive: 'hide-tablet', isProject: false },
        ];
        
        const initialFlowers = [...projectFlowers, ...decorativeFlowers];
        
        // Validation: Check that all projects with same adjective have same shape
        if (process.env.NODE_ENV === 'development') {
            const adjectiveShapeMap = {};
            projectFlowers.forEach(flower => {
                const adj = flower.projectAdjective;
                if (adj) {
                    if (!adjectiveShapeMap[adj]) {
                        adjectiveShapeMap[adj] = flower.shape;
                    } else if (adjectiveShapeMap[adj] !== flower.shape) {
                        console.error(`🐛 SHAPE INCONSISTENCY DETECTED!`);
                        console.error(`Adjective "${adj}" has multiple shapes:`);
                        console.error(`  Expected: shape${adjectiveShapeMap[adj]}`);
                        console.error(`  Found: shape${flower.shape}`);
                        console.error(`  Project:`, flower.project.projectName);
                    }
                }
            });
            
            // Log shape distribution for debugging
            console.log('🌸 Shape Distribution by Adjective:');
            Object.entries(adjectiveShapeMap).forEach(([adj, shape]) => {
                const count = projectFlowers.filter(f => f.projectAdjective === adj).length;
                console.log(`  ${adj}: shape${shape} (${count} projects)`);
            });
        }

        // Use calculated container width for "All" mode
        const width = containerWidth;
        const height = dimensionsRef.current.height;

        // Calculate cluster centers based on current grouping mode
        const clusterCenters = calculateClusterCenters(initialFlowers, groupingMode, width);

        // Assign each flower to a cluster based on grouping mode
        const flowersWithClusters = assignFlowersToClusters(initialFlowers, clusterCenters, groupingMode);
        
        // Store flowers data for later updates
        flowersDataRef.current = flowersWithClusters;

        // Create D3 force simulation with bounds to prevent vertical cutoff
        // Different configuration for "All" mode vs grouped modes
        const isAllMode = groupingMode === 'all';
        
        const simulation = d3.forceSimulation(flowersWithClusters)
            .force('x', d3.forceX(d => d.clusterX).strength(isAllMode ? 0.15 : 0.3))
            // For "All" mode: create pile effect with vertical clustering
            .force('y', d3.forceY(d => {
                if (isAllMode) {
                    const baseY = height - 120;
                    return baseY + (d.verticalOffset || 0);
                }
                return height - 100;
            }).strength(isAllMode ? 0.25 : 0.6))
            // Reduce collision radius in "All" mode to allow overlap for pile effect
            .force('collide', d3.forceCollide(d => {
                const baseRadius = d.radius;
                return isAllMode ? baseRadius * 0.7 : baseRadius; // 70% radius allows moderate overlap
            }).strength(0.7))
            // Light repulsion in "All" mode for natural spacing
            .force('charge', d3.forceManyBody().strength(isAllMode ? -15 : 5).distanceMax(200))
            // Add bounds force to keep flowers visible vertically
            .force('bounds', () => {
                flowersWithClusters.forEach(d => {
                    const buffer = d.radius;
                    if (isAllMode) {
                        // Allow more vertical range for pile effect
                        d.y = Math.max(buffer + 40, Math.min(height - buffer - 10, d.y));
                    } else {
                        d.y = Math.max(buffer + 60, Math.min(height - buffer - 20, d.y));
                    }
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
                case 'large': return { width: 200, height: 200 };
                case 'medium': return { width: 180, height: 180 };
                case 'small': return { width: 150, height: 150 };
                default: return { width: 180, height: 180 };
            }
        };

        // Create flower groups
        const flowerGroups = svg.selectAll('g.flower-group')
            .data(flowersWithClusters, d => d.id)
            .join('g')
            .attr('class', d => `flower-group flower-${d.size} ${d.responsive || ''} ${d.isProject ? 'project-flower' : 'decorative-flower'}`)
            .attr('transform', d => `translate(${d.x}, ${d.y})`)
            .style('cursor', 'grab')
            .style('z-index', d => {
                // For "All" mode: set z-index based on y position and layer for depth effect
                if (groupingMode === 'all') {
                    const baseZ = Math.floor(d.y || 0);
                    const layerBonus = (d.layer || 0) * 10;
                    return baseZ + layerBonus;
                }
                return 10;
            });

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
                
                // Responsive font size and max width based on viewport
                const viewportWidth = window.innerWidth;
                let fontSize, maxWidth, padding;
                
                if (viewportWidth < 480) {
                    // Mobile
                    fontSize = '11px';
                    maxWidth = 250;
                    padding = 20; // 10px each side
                } else if (viewportWidth < 768) {
                    // Small tablet
                    fontSize = '12px';
                    maxWidth = 300;
                    padding = 24; // 12px each side
                } else {
                    // Desktop
                    fontSize = '14px';
                    maxWidth = 400;
                    padding = 32; // 16px each side
                }
                
                // Add text first to measure its width
                const text = labelGroup.append('text')
                    .attr('y', h / 2 + 32)
                    .attr('text-anchor', 'middle')
                    .style('font-size', fontSize)
                    .style('font-weight', '600')
                    .style('fill', '#333')
                    .text(d.project.projectName || 'Project');
                
                // Measure text width and calculate dynamic label dimensions
                const textBBox = text.node().getBBox();
                const minWidth = 80;
                const labelWidth = Math.min(maxWidth, Math.max(minWidth, textBBox.width + padding));
                const labelHeight = 35;
                
                // Insert background rect before text (so text appears on top)
                labelGroup.insert('rect', 'text')
                    .attr('x', -labelWidth / 2)
                    .attr('y', h / 2 + 10)
                    .attr('width', labelWidth)
                    .attr('height', labelHeight)
                    .attr('rx', 8)
                    .style('fill', 'rgba(255, 255, 255, 0.85)')
                    .style('stroke', '#ffffff')
                    .style('stroke-width', '2px')
                    .style('filter', 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15))');
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
                    // Bring to front on hover
                    d3.select(this)
                        .raise()
                        .style('z-index', 1000)
                        .style('filter', 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))')
                        .transition()
                        .duration(200)
                        .attr('transform', function(d) {
                            return `translate(${d.x}, ${d.y}) scale(1.15)`;
                        });
                    
                    d3.select(this).select('.flower-label-group')
                        .transition()
                        .duration(200)
                        .style('opacity', 1);
                }
            })
            .on('mouseleave', function(event, d) {
                // Reset z-index based on mode
                const zIndex = groupingMode === 'all' 
                    ? Math.floor(d.y || 0) + ((d.layer || 0) * 10)
                    : 10;
                
                d3.select(this)
                    .style('z-index', zIndex)
                    .style('filter', 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15))')
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

        // Function to calculate and render cluster labels
        const renderClusterLabels = () => {
            renderClusterLabelsForMode(svg, flowersWithClusters, groupingMode);
        };
        
        // Update positions on simulation tick
        simulation.on('tick', () => {
            flowerGroups.attr('transform', d => `translate(${d.x}, ${d.y})`);
        });
        
        // Render cluster labels after initial simulation
        setTimeout(() => renderClusterLabels(), 500);

        // Restart simulation for interactive updates
        simulation.restart();

        // Handle window resize
        const handleResize = () => {
            updateDimensions();
            let { width: newWidth, height: newHeight } = dimensionsRef.current;
            
            if (flowersDataRef.current.length === 0) return;
            
            // Recalculate width for "All" mode
            if (groupingMode === 'all') {
                const totalFlowers = flowersDataRef.current.length;
                const viewportWidth = window.innerWidth;
                const widthPerFlower = viewportWidth < 768 ? 50 : viewportWidth < 1024 ? 60 : 70;
                const calculatedWidth = totalFlowers * widthPerFlower;
                newWidth = Math.max(viewportWidth * 1.5, calculatedWidth);
                
                // Update SVG width
                d3.select(svgRef.current).attr('width', newWidth);
            }
            
            // Recalculate cluster centers for new width
            const newClusterCenters = calculateClusterCenters(flowersDataRef.current, groupingMode, newWidth);
            
            // Reassign flowers to clusters with new positions
            const updatedFlowers = assignFlowersToClusters(flowersDataRef.current, newClusterCenters, groupingMode);
            flowersDataRef.current = updatedFlowers;
            
            // Update simulation forces
            simulation.nodes(updatedFlowers);
            simulation
                .force('x', d3.forceX(d => d.clusterX).strength(groupingMode === 'all' ? 0.15 : 0.3))
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
        
        let { width, height } = dimensionsRef.current;
        const flowers = flowersDataRef.current;
        
        // Recalculate width for "All" mode
        if (groupingMode === 'all') {
            const totalFlowers = flowers.length;
            const viewportWidth = window.innerWidth;
            const widthPerFlower = viewportWidth < 768 ? 50 : viewportWidth < 1024 ? 60 : 70;
            const calculatedWidth = totalFlowers * widthPerFlower;
            width = Math.max(viewportWidth * 1.5, calculatedWidth);
            
            // Update SVG width
            d3.select(svgRef.current).attr('width', width);
        } else {
            // Reset to default width for other modes
            width = dimensionsRef.current.width;
            d3.select(svgRef.current).attr('width', width);
        }
        
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
            
            // Update cluster labels after transition
            const svg = d3.select(svgRef.current);
            if (groupingMode !== 'projectType' && groupingMode !== 'projectEmotions') {
                svg.selectAll('.cluster-label-group').remove();
            } else {
                // Re-render labels for new grouping (both projectType and projectEmotions)
                renderClusterLabelsForMode(svg, updatedFlowers, groupingMode);
            }
        }, 1500);
        
    }, [groupingMode, renderClusterLabelsForMode]);

    // Handle highlighting of specific flower when navigating from Shelf
    useEffect(() => {
        if (!highlightedProjectId || !svgRef.current) return;
        
        const svg = d3.select(svgRef.current);
        
        // Helper function to get size dimensions
        const getSizeClass = (size) => {
            switch(size) {
                case 'large': return { width: 200, height: 200 };
                case 'medium': return { width: 180, height: 180 };
                case 'small': return { width: 150, height: 150 };
                default: return { width: 180, height: 180 };
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
                .attr('stroke-width', 2)
                .attr('opacity', 0)
                .transition()
                .duration(600)
                .attr('opacity', 1)
                .attr('stroke-width', 4)
                .transition()
                .duration(600)
                .attr('opacity', 0)
                .attr('stroke-width', 2)
                .on('end', function repeat() {
                    d3.select(this)
                        .transition()
                        .duration(600)
                        .attr('opacity', 1)
                        .attr('stroke-width', 4)
                        .transition()
                        .duration(600)
                        .attr('opacity', 0)
                        .attr('stroke-width', 2)
                        .on('end', repeat);
                });
        }
        
        // Clean up when highlight is removed
        return () => {
            // Stop any running transitions on highlight rings to prevent position shifts
            svg.selectAll('.highlight-ring')
                .interrupt() // Stop any active transitions
                .remove();
            
            // Remove highlight class without affecting position
            svg.selectAll('.flower-group').classed('highlighted', false);
        };
    }, [highlightedProjectId]);

    return (
        <div className="flower-field-container">
            {/* Grouping Toggle UI - Neobrutalism Radio Style */}
            <div className="flower-grouping-toggle">
                <div className="toggle-wrapper">
                    <div className="toggle-option">
                        <input 
                            checked={groupingMode === 'all'}
                            value="all" 
                            name="flower-sort" 
                            type="radio" 
                            className="toggle-input"
                            onChange={() => onGroupingChange && onGroupingChange('all')}
                            title="Show all flowers ungrouped"
                        />
                        <div className="toggle-btn">
                            <span className="toggle-span">🌸 All</span>
                        </div>
                    </div>
                    
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

