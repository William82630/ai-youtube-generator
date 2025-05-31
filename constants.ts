
export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

// A simple check for API key availability. 
// In a real build process, process.env.API_KEY would be substituted.
// For this environment, we simulate its presence or absence.
// In a real scenario, this check might be more complex or handled by build tools.
export const GEMINI_API_KEY_AVAILABLE = typeof import.meta.env.VITE_API_KEY === 'string' && import.meta.env.VITE_API_KEY.length > 0;


