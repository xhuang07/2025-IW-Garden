// client/src/pages/Shelf.js
// Harvest Shelf page for browsing all projects

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Sticker from '../components/Sticker';
import '../styles/Shelf.css';

function Shelf({ projects, onProjectLiked }) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [filteredProjects, setFilteredProjects] = useState(projects);
    const [selectedProject, setSelectedProject] = useState(null);
    
    useEffect(() => {
        filterAndSortProjects();
    }, [projects, searchTerm, filterType, sortBy]);
    
    const filterAndSortProjects = () => {
        let filtered = [...projects];
        
        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(project => 
                project.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.creator?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Type filter
        if (filterType !== 'all') {
            filtered = filtered.filter(project => 
                project.stickerData?.fruitType === filterType
            );
        }
        
        // Sort
        switch (sortBy) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'popular':
                filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
                break;
            case 'name':
                filtered.sort((a, b) => a.projectName.localeCompare(b.projectName));
                break;
            default:
                break;
        }
        
        setFilteredProjects(filtered);
    };
    
    const handleProjectClick = (project) => {
        setSelectedProject(project);
    };
    
    const handleLike = (e, projectId) => {
        e.stopPropagation();
        onProjectLiked(projectId);
    };
    
    // Get unique fruit types for filter
    const fruitTypes = [...new Set(projects.map(p => p.stickerData?.fruitType).filter(Boolean))];
    
    return (
        <div className="shelf-page">
            <motion.div 
                className="shelf-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* <h1>🥬 Harvest Shelf</h1> */}
                {/* <p>Browse the fruits of innovation</p> */}
            </motion.div>
            
            {/* Search and Filter Bar */}
            <motion.div 
                className="shelf-controls"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search projects, locations, or creators..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="filter-controls">
                    <select 
                        value={filterType} 
                        onChange={(e) => setFilterType(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">🍎 All Fruits</option>
                        {fruitTypes.map(type => (
                            <option key={type} value={type}>
                                {type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Other'}
                            </option>
                        ))}
                    </select>
                    
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        <option value="newest">🆕 Newest First</option>
                        <option value="oldest">📅 Oldest First</option>
                        <option value="popular">❤️ Most Liked</option>
                        <option value="name">🔤 By Name</option>
                    </select>
                </div>
                
                <div className="results-count">
                    Found {filteredProjects.length} fresh {filteredProjects.length === 1 ? 'project' : 'projects'}
                </div>
            </motion.div>
            
            {/* Projects Grid */}
            <motion.div 
                className="shelf-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <AnimatePresence>
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            className="shelf-item"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ 
                                y: -10,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                            }}
                            onClick={() => handleProjectClick(project)}
                        >
                            <div className="shelf-item-sticker">
                                <Sticker 
                                    data={{
                                        ...project.stickerData,
                                        projectName: project.projectName,
                                        location: project.location,
                                        creator: project.creator,
                                        date: new Date(project.createdAt).toLocaleDateString()
                                    }} 
                                />
                            </div>
                            
                            <div className="shelf-item-info">
                                <h3>{project.projectName}</h3>
                                <p className="location">📍 {project.location}</p>
                                <p className="creator">👤 {project.creator}</p>
                                
                                <div className="shelf-item-actions">
                                    <button 
                                        className="like-btn"
                                        onClick={(e) => handleLike(e, project.id)}
                                    >
                                        ❤️ {project.likes || 0}
                                    </button>
                                    
                                    {project.projectLink && (
                                        <a 
                                            href={project.projectLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="link-btn"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            🔗
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {filteredProjects.length === 0 && (
                    <div className="no-results">
                        <span className="no-results-emoji">🔍</span>
                        <h3>No projects found</h3>
                        <p>Try adjusting your search or filters</p>
                    </div>
                )}
            </motion.div>
            
            {/* Project Detail Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div 
                        className="project-detail-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div 
                            className="project-detail-modal"
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 50 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button 
                                className="modal-close"
                                onClick={() => setSelectedProject(null)}
                            >
                                ✕
                            </button>
                            
                            <div className="modal-content-grid">
                                <div className="modal-sticker">
                                    <Sticker 
                                        data={{
                                            ...selectedProject.stickerData,
                                            projectName: selectedProject.projectName,
                                            location: selectedProject.location,
                                            creator: selectedProject.creator,
                                            date: new Date(selectedProject.createdAt).toLocaleDateString()
                                        }} 
                                    />
                                </div>
                                
                                <div className="modal-details">
                                    <h2>{selectedProject.projectName}</h2>
                                    
                                    <div className="detail-row">
                                        <span className="detail-label">📍 Location:</span>
                                        <span>{selectedProject.location}</span>
                                    </div>
                                    
                                    <div className="detail-row">
                                        <span className="detail-label">👤 Created by:</span>
                                        <span>{selectedProject.creator}</span>
                                    </div>
                                    
                                    <div className="detail-row">
                                        <span className="detail-label">📅 Planted on:</span>
                                        <span>{new Date(selectedProject.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    
                                    <div className="detail-row">
                                        <span className="detail-label">❤️ Likes:</span>
                                        <span>{selectedProject.likes || 0}</span>
                                    </div>
                                    
                                    {selectedProject.screenshot && (
                                        <div className="modal-screenshot">
                                            <img 
                                                src={`http://localhost:5000${selectedProject.screenshot}`}
                                                alt={selectedProject.projectName}
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="modal-actions">
                                        <button 
                                            className="action-btn like"
                                            onClick={() => onProjectLiked(selectedProject.id)}
                                        >
                                            ❤️ Like Project
                                        </button>
                                        
                                        <button 
                                            className="action-btn garden"
                                            onClick={() => {
                                                const projectId = selectedProject.id || selectedProject._id;
                                                console.log('🔗 SHELF: "See in Garden" clicked for project:', selectedProject.projectName);
                                                console.log('🔗 SHELF: Project ID:', projectId, 'Type:', typeof projectId);
                                                console.log('🔗 SHELF: Full project data:', selectedProject);
                                                navigate('/', { state: { highlightProjectId: projectId } });
                                            }}
                                        >
                                            🌸 See in Garden
                                        </button>
                                        
                                        {selectedProject.projectLink && (
                                            <a 
                                                href={selectedProject.projectLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="action-btn visit"
                                            >
                                                🔗 Visit Project
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Shelf;