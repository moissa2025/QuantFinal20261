// authClient.ts
const API_BASE = "http://localhost:8080";

// ---- Token Storage ----
let sessionToken: string | null = null;
let refreshToken: string | null = null;

export function setTokens(session: string, refresh: string) {
  sessionToken = session;
  refreshToken = refresh;
  sessionStorage.setItem("session_token", session);
  sessionStorage.setItem("refresh_token", refresh);
}

export function loadTokens() {
  sessionToken = sessionStorage.getItem("session_token");
  refreshToken = sessionStorage.getItem("refresh_token");
}

export function clearTokens() {
  sessionToken = null;
  refreshToken = null;
  sessionStorage.removeItem("session_token");
  sessionStorage.removeItem("refresh_token");
}

// ---- Helper: JSON Request ----
async function jsonRequest(path: string, options: RequestInit = {}) {
  const headers: any = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (sessionToken) {
    headers["Authorization"] = `Bearer ${sessionToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  // If session expired → try refresh
  if (res.status === 401 && refreshToken) {
    const refreshed = await refresh();
    if (refreshed) {
      return jsonRequest(path, options);
    }
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return res.json().catch(() => ({}));
}

// ---- Identity API ----

export async function register(payload: {
  email: string;
  password: string;
}) {
  return jsonRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function activate(token: string) {
  return jsonRequest("/auth/activate", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
}

export async function login(email: string, password: string) {
  const res = await jsonRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // MFA required
  if (res.mfa_required) {
    return {
      mfa_required: true,
      mfa_type: res.mfa_type,
    };
  }

  // Normal login
  if (res.session_token && res.refresh_token) {
    setTokens(res.session_token, res.refresh_token);
  }

  return res;
}

export async function verifyMfa(payload: {
  method: "email" | "totp";
  code: string;
}) {
  const res = await jsonRequest("/auth/mfa/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (res.session_token && res.refresh_token) {
    setTokens(res.session_token, res.refresh_token);
  }

  return res;
}

export async function setupTotp(code: string) {
  return jsonRequest("/auth/mfa/setup", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export async function logout() {
  await jsonRequest("/auth/logout", { method: "POST" });
  clearTokens();
}

export async function validateSession() {
  return jsonRequest("/auth/validate", {
    method: "POST",
  });
}

export async function introspect() {
  return jsonRequest("/auth/introspect", {
    method: "POST",
  });
}

export async function refresh() {
  if (!refreshToken) return false;

  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) {
    clearTokens();
    return false;
  }

  const data = await res.json();
  if (data.session_token && data.refresh_token) {
    setTokens(data.session_token, data.refresh_token);
    return true;
  }

  return false;
}

