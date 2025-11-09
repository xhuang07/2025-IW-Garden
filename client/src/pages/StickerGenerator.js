// client/src/pages/StickerGenerator.js
// Page for generating fruit stickers from project uploads

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sticker from '../components/Sticker';
import { generateFruitType } from '../utils/fruitGenerator';
import '../styles/StickerGenerator.css';

function StickerGenerator({ onProjectAdded }) {
    const navigate = useNavigate();
    
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
    const [plantedProjectId, setPlantedProjectId] = useState(null);
    
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
    
    // Animal names for auto-generation
    const animals = [
        'Bear', 'Giraffe', 'Owl', 'Fox', 'Wolf', 'Deer', 'Eagle', 
        'Penguin', 'Lion', 'Tiger', 'Elephant', 'Dolphin', 'Panda',
        'Koala', 'Hawk', 'Raven', 'Leopard', 'Cheetah', 'Otter', 'Falcon'
    ];
    
    // Generate random animal name
    const generateAnimalName = () => {
        const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
        return `Anonymous ${randomAnimal}`;
    };
    
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
        
        // Auto-generate animal name if creator field is empty
        const finalCreator = formData.creator || generateAnimalName();
        
        // Generate sticker if not already generated
        if (!generatedSticker) {
            generateSticker();
        }
        
        // Create form data for upload
        const uploadData = new FormData();
        uploadData.append('projectName', formData.projectName);
        uploadData.append('location', formData.location);
        uploadData.append('creator', finalCreator);
        uploadData.append('projectLink', formData.projectLink);
        uploadData.append('fruitType', generatedSticker?.fruitType || 'shape1');
        uploadData.append('stickerColor', generatedSticker?.color || '#FEA57D');
        uploadData.append('projectAdjective', formData.madLibAdjective || '');
        uploadData.append('projectFeeling', formData.madLibFeeling || '');
        
        if (screenshot) {
            uploadData.append('screenshot', screenshot);
        }
        
        try {
            console.log('📤 SUBMIT: Sending project data to server...');
            console.log('📤 SUBMIT: Form data values:', {
                projectName: formData.projectName,
                location: formData.location,
                creator: finalCreator,
                projectLink: formData.projectLink,
                madLibAdjective: formData.madLibAdjective,
                madLibFeeling: formData.madLibFeeling,
                fruitType: generatedSticker?.fruitType,
                stickerColor: generatedSticker?.color
            });
            
            const response = await fetch('http://localhost:5000/api/projects', {
                method: 'POST',
                body: uploadData
            });
            
            console.log('📤 SUBMIT: Response status:', response.status);
            const data = await response.json();
            console.log('📤 SUBMIT: Response data:', data);
            
            if (data.success) {
                console.log('✅ SUBMIT: Project planted successfully!', data.project);
                onProjectAdded(data.project);
                
                // Store the planted project ID for "See in Garden" button
                const projectId = data.project.id || data.project._id;
                setPlantedProjectId(projectId);
                setShowSuccess(true);
                
                // Reset form after 5 seconds (increased to give time to click "See in Garden")
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
                    setPlantedProjectId(null);
                }, 5000);
            } else {
                console.error('❌ SUBMIT: Server returned error:', data);
                alert(data.message || 'Failed to plant project');
            }
        } catch (error) {
            console.error('❌ SUBMIT: Error creating project:', error);
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
                {/* <h1>🍎 Plant Your Project</h1> */}
                {/* <p>Turn your innovation into a fresh fruit sticker!</p> */}
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
                        
                        {/* Mad Libs Typography-Heavy Section */}
                        <div className="mad-libs-statement">
                            <div className="statement-line">
                                <span className="statement-text">I grow </span>
                                <input
                                    type="text"
                                    name="projectName"
                                    value={formData.projectName}
                                    onChange={handleInputChange}
                                    placeholder="My Amazing Innovation"
                                    className="inline-input project-name-input"
                                    required
                                />
                            </div>
                            
                            <div className="statement-line">
                                <span className="statement-text">in </span>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="Innovation Lab, Building A"
                                    className="inline-input location-input"
                                    required
                                />
                                <span className="statement-text">,</span>
                            </div>
                            
                            <div className="statement-line">
                                <span className="statement-text">it is </span>
                                <select
                                    name="madLibAdjective"
                                    value={formData.madLibAdjective}
                                    onChange={handleInputChange}
                                    className="inline-select"
                                >
                                    <option value="">adjective</option>
                                    {adjectives.map(adj => (
                                        <option key={adj} value={adj}>{adj}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="statement-line">
                                <span className="statement-text">and makes me feel </span>
                                <select
                                    name="madLibFeeling"
                                    value={formData.madLibFeeling}
                                    onChange={handleInputChange}
                                    className="inline-select"
                                >
                                    <option value="">feeling</option>
                                    {feelings.map(feel => (
                                        <option key={feel} value={feel}>{feel}</option>
                                    ))}
                                </select>
                                <span className="statement-text">.</span>
                            </div>
                        </div>
                        
                        {/* Attribution Line */}
                        <div className="attribution-line">
                            <span className="attribution-text">By </span>
                            <input
                                type="text"
                                name="creator"
                                value={formData.creator}
                                onChange={handleInputChange}
                                placeholder="Anonymous Gardener"
                                className="inline-input attribution-input"
                            />
                        </div>
                        
                        {/* Project Link - Secondary */}
                        <div className="form-group secondary-field">
                            <label>Project Link</label>
                            <input
                                type="url"
                                name="projectLink"
                                value={formData.projectLink}
                                onChange={handleInputChange}
                                placeholder="https://..."
                            />
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
                            <p>Your project is now blooming in the garden!</p>
                            <button 
                                className="see-in-garden-btn"
                                onClick={() => navigate('/', { state: { highlightProjectId: plantedProjectId } })}
                            >
                                🌸 See it in Garden
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

export default StickerGenerator;