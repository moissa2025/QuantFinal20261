const API_BASE = "https://api.globalquantx.com";

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
    headers["Authorization"] = `Session ${sessionToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401 || res.status === 403) {
    throw new Error("unauthorized");
  }

  return res;
}

