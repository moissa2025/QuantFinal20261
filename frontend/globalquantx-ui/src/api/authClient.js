import { apiFetch, setSessionToken } from "./httpClient";

const STORAGE_KEY = "gqx_auth";

function saveAuth(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  setSessionToken(data.access_token);
}

export function loadAuth() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    setSessionToken(parsed.access_token);
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
  // DEV MODE: guaranteed valid login
  if (email === "admin@gqx.com" && password === "test123") {
    const auth = {
      user_id: "dev-admin",
      access_token: "dev-token",
      refresh_token: "dev-refresh",
      expires_in: 3600,
      mfa_required: false,
    };

    saveAuth(auth);
    return auth;
  }

  // Otherwise call backend normally
  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      user_agent: navigator.userAgent,
    }),
  });

  if (!res.ok) throw new Error("login_failed");
  const data = await res.json();

  const auth = {
    user_id: data.user_id,
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    mfa_required: data.mfa_required || false,
  };

  if (!auth.mfa_required) {
    saveAuth(auth);
  }

  return auth;
}

export async function verifyMfa(code) {
  const res = await apiFetch("/auth/mfa/verify", {
    method: "POST",
    body: JSON.stringify({ code }),
  });

  if (!res.ok) throw new Error("mfa_failed");
  const data = await res.json();

  const auth = {
    user_id: data.user_id,
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
  };

  saveAuth(auth);
  return auth;
}

export async function requestPasswordReset(email) {
  const res = await apiFetch("/auth/password/reset/request", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

  if (!res.ok) throw new Error("reset_request_failed");
  return res.json();
}

export async function confirmPasswordReset(token, newPassword) {
  const res = await apiFetch("/auth/password/reset/confirm", {
    method: "POST",
    body: JSON.stringify({ token, new_password: newPassword }),
  });

  if (!res.ok) throw new Error("reset_confirm_failed");
  return res.json();
}

export async function logout() {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch {}
  clearAuth();
}

