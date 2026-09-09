// Centralized API configuration for MPSA School ERP

const getRawUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;

  if (envUrl && envUrl.trim()) {
    return envUrl.trim();
  }

  // Local development
  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }

  // Production
  return "https://school-web-hng4.onrender.com";
};

const sanitizeUrl = (url) => {
  let cleaned = String(url).trim();

  // Remove accidental quotes
  cleaned = cleaned.replace(/^["']|["']$/g, "").trim();

  // Remove trailing slash
  cleaned = cleaned.replace(/\/+$/, "");

  // If /api was already included, remove it.
  // We will add it exactly once below.
  cleaned = cleaned.replace(/\/api$/i, "");

  // Production must use HTTPS
  if (!cleaned.includes("localhost")) {
    cleaned = cleaned.replace(/^https?:\/\//i, "");
    cleaned = `https://${cleaned}`;
  }

  return cleaned;
};

const SERVER_URL = sanitizeUrl(getRawUrl());

// Always exactly:
// https://school-web-hng4.onrender.com/api
export const API_BASE_URL = `${SERVER_URL}/api`;

// Without /api
export const SERVER_BASE_URL = SERVER_URL;

export default API_BASE_URL;