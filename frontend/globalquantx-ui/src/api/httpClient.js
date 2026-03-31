// src/api/httpClient.js
const API_BASE = ""; // Vite proxy handles routing

let sessionToken = null;

export function setSessionToken(token) {
  sessionToken = token;
}

export async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (sessionToken) {
    headers["Authorization"] = `Bearer ${sessionToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  return res;
}

