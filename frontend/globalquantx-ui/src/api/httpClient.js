// src/api/httpClient.js

// Vite proxy handles routing, so base stays empty
const API_BASE = "";

let sessionToken = null;

// Store JWT in memory (not localStorage)
export function setSessionToken(token) {
  sessionToken = token;
}

// Unified fetch wrapper
export async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Attach JWT if present
  if (sessionToken) {
    headers["Authorization"] = `Bearer ${sessionToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include", // allows cookies if needed
  });

  // Optional: auto‑parse JSON if response is JSON
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  }

  return { ok: res.ok, status: res.status, data: null };
}

// Default export for compatibility with existing imports
const client = {
  fetch: apiFetch,
  setSessionToken,
};

export default client;

