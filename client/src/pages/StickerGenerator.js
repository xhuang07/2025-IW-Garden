// client/src/pages/StickerGenerator.js
// Page for generating fruit stickers from project uploads

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Sticker from '../components/Sticker';
import { generateFruitType } from '../utils/fruitGenerator';
import '../styles/StickerGenerator.css';

function StickerGenerator({ onProjectAdded }) {
    const [formData, setFormData] = useState({
        projectName: '',
        location: '',
        creator: '',
        projectLink: '',
        madLibAdjective: '',
        madLibFeeling: ''
    });
    
    const [screenshot, setScreenshot] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [generatedSticker, setGeneratedSticker] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    const fileInputRef = useRef(null);
    const stickerRef = useRef(null);
    
    // Mad Libs options
    const adjectives = [
        'Revolutionary', 'Innovative', 'Disruptive', 'Fresh', 'Bold',
        'Crispy', 'Juicy', 'Ripe', 'Organic', 'Sustainable',
        'Electric', 'Magnetic', 'Quantum', 'Neural', 'Atomic'
    ];
    
    const feelings = [
        'Excited', 'Inspired', 'Energized', 'Empowered', 'Motivated',
        'Refreshed', 'Invigorated', 'Charged', 'Enlightened', 'Transformed'
    ];
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setScreenshot(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };
    
    const generateSticker = () => {
        // Generate fruit based on Mad Libs
        const fruitData = generateFruitType(
            formData.madLibAdjective,
            formData.madLibFeeling,
            formData.projectName
        );
        
        const stickerData = {
            ...fruitData,
            projectName: formData.projectName,
            location: formData.location,
            creator: formData.creator || 'Anonymous Gardener',
            text: `I grow ${formData.projectName} in ${formData.location}`,
            date: new Date().toLocaleDateString()
        };
        
        setGeneratedSticker(stickerData);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.projectName || !formData.location) {
            alert('Please fill in project name and location!');
            return;
        }
        
        setIsGenerating(true);
        
        // Generate sticker if not already generated
        if (!generatedSticker) {
            generateSticker();
        }
        
        // Create form data for upload
        const uploadData = new FormData();
        uploadData.append('projectName', formData.projectName);
        uploadData.append('location', formData.location);
        uploadData.append('creator', formData.creator || 'Anonymous Gardener');
        uploadData.append('projectLink', formData.projectLink);
        uploadData.append('fruitType', generatedSticker?.fruitType || 'apple');
        uploadData.append('stickerColor', generatedSticker?.color || '#FEA57D');
        
        if (screenshot) {
            uploadData.append('screenshot', screenshot);
        }
        
        try {
            const response = await fetch('http://localhost:5000/api/projects', {
                method: 'POST',
                body: uploadData
            });
            
            const data = await response.json();
            
            if (data.success) {
                onProjectAdded(data.project);
                setShowSuccess(true);
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    setFormData({
                        projectName: '',
                        location: '',
                        creator: '',
                        projectLink: '',
                        madLibAdjective: '',
                        madLibFeeling: ''
                    });
                    setScreenshot(null);
                    setPreviewUrl(null);
                    setGeneratedSticker(null);
                    setShowSuccess(false);
                }, 3000);
            }
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to plant project in garden');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const downloadSticker = () => {
        if (!stickerRef.current) return;
        
        // Convert sticker to canvas and download
        // This is simplified - in production you'd use html2canvas or similar
        alert('Sticker download feature coming soon! For now, take a screenshot 📸');
    };
    
    return (
        <div className="sticker-generator-page">
            <motion.div 
                className="generator-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1>🍎 Plant Your Project</h1>
                <p>Turn your innovation into a fresh fruit sticker!</p>
            </motion.div>
            
            <div className="generator-container">
                <motion.div 
                    className="form-section"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <form onSubmit={handleSubmit} className="project-form">
                        <h2>📝 Project Details</h2>
                        
                        <div className="form-group">
                            <label>Project Name *</label>
                            <input
                                type="text"
                                name="projectName"
                                value={formData.projectName}
                                onChange={handleInputChange}
                                placeholder="My Amazing Innovation"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Location *</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="Innovation Lab, Building A"
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Your Name (Optional)</label>
                            <input
                                type="text"
                                name="creator"
                                value={formData.creator}
                                onChange={handleInputChange}
                                placeholder="Anonymous Gardener"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Project Link</label>
                            <input
                                type="url"
                                name="projectLink"
                                value={formData.projectLink}
                                onChange={handleInputChange}
                                placeholder="https://..."
                            />
                        </div>
                        
                        <div className="mad-libs-section">
                            <h3>🎲 Mad Libs (Choose Your Fruit!)</h3>
                            <p>My project is...</p>
                            
                            <div className="mad-libs-row">
                                <select
                                    name="madLibAdjective"
                                    value={formData.madLibAdjective}
                                    onChange={handleInputChange}
                                    className="mad-lib-select"
                                >
                                    <option value="">Select adjective...</option>
                                    {adjectives.map(adj => (
                                        <option key={adj} value={adj}>{adj}</option>
                                    ))}
                                </select>
                                
                                <span>and makes me feel</span>
                                
                                <select
                                    name="madLibFeeling"
                                    value={formData.madLibFeeling}
                                    onChange={handleInputChange}
                                    className="mad-lib-select"
                                >
                                    <option value="">Select feeling...</option>
                                    {feelings.map(feel => (
                                        <option key={feel} value={feel}>{feel}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Screenshot (Optional)</label>
                            <div 
                                className="file-upload-area"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {previewUrl ? (
                                    <img src={previewUrl} alt="Preview" className="preview-image" />
                                ) : (
                                    <div className="upload-placeholder">
                                        <span className="upload-icon">📸</span>
                                        <p>Click to upload screenshot</p>
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                        
                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={generateSticker}
                                className="preview-button"
                                disabled={!formData.projectName || !formData.location}
                            >
                                🎨 Preview Sticker
                            </button>
                            
                            <button
                                type="submit"
                                className="submit-button"
                                disabled={isGenerating || !formData.projectName || !formData.location}
                            >
                                {isGenerating ? '🌱 Planting...' : '🌱 Plant in Garden'}
                            </button>
                        </div>
                    </form>
                </motion.div>
                
                <motion.div 
                    className="preview-section"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2>🏷️ Your Fresh Sticker</h2>
                    
                    <div className="sticker-preview" ref={stickerRef}>
                        {generatedSticker ? (
                            <Sticker data={generatedSticker} />
                        ) : (
                            <div className="sticker-placeholder">
                                <span className="placeholder-emoji">🍎</span>
                                <p>Fill in the form to generate your unique fruit sticker!</p>
                            </div>
                        )}
                    </div>
                    
                    {generatedSticker && (
                        <button onClick={downloadSticker} className="download-button">
                            💾 Download Sticker
                        </button>
                    )}
                    
                    {showSuccess && (
                        <motion.div 
                            className="success-message"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <span className="success-emoji">🎉</span>
                            <h3>Project Planted Successfully!</h3>
                            <p>Visit the garden to see your fruit growing!</p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

export default StickerGenerator;