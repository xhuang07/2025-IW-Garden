// API Configuration
// In production, use relative URLs (same origin)
// In development, use localhost:5000
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' 
  : 'http://localhost:5000';

export const API_ENDPOINTS = {
  projects: `${API_BASE_URL}/api/projects`,
  health: `${API_BASE_URL}/api/health`,
};

