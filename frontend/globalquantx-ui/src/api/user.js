import { apiClient } from "./client";

export function login(email, password) {
  return apiClient("/user/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_role");
}

export function getProfile() {
  return apiClient("/user/me");
}

