const configuredApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Accept either an API origin or an origin that already ends in /api.
export const API_BASE_URL = `${configuredApiUrl.replace(/\/+$/, '').replace(/\/api$/i, '')}/api`;
