import { apiFetch, setSessionToken } from "./httpClient";

const STORAGE_KEY = "gqx_auth";

function saveAuth(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  setSessionToken(data.session_token);
}

export function loadAuth() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    setSessionToken(parsed.session_token);
    return parsed;
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY);
  setSessionToken(null);
}

export async function login(email, password) {
  const res = await apiFetch("/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      user_agent: navigator.userAgent,
      ip_address: null,
    }),
  });

  if (!res.ok) throw new Error("login_failed");
  const data = await res.json();

  const auth = {
    user_id: data.user_id,
    session_token: data.session_token,
    roles: data.roles || [],
    refresh_token: data.refresh_token || null,
    ttl_seconds: data.ttl_seconds,
  };

  saveAuth(auth);
  return auth;
}

export async function validateSession(session_token) {
  const res = await apiFetch("/v1/auth/validate", {
    method: "POST",
    body: JSON.stringify({ token: session_token }),
  });

  if (!res.ok) throw new Error("validate_failed");
  return res.json();
}

export async function refreshSession(refresh_token) {
  const res = await apiFetch("/v1/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token }),
  });

  if (!res.ok) throw new Error("refresh_failed");
  const data = await res.json();

  const auth = {
    user_id: data.user_id,
    session_token: data.session_token,
    roles: [],
    refresh_token: data.refresh_token,
    ttl_seconds: data.ttl_seconds,
  };

  saveAuth(auth);
  return auth;
}

export async function logout(session_token) {
  try {
    await apiFetch("/v1/auth/logout", {
      method: "POST",
      body: JSON.stringify({ token: session_token }),
    });
  } catch {}
  clearAuth();
}

