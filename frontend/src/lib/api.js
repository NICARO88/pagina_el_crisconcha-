const cleanBase = (import.meta.env.VITE_API_BASE || '').replace(/\/+$/, '');
export const API_BASE = cleanBase;
