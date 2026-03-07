export function isAuthenticated() {
  const token = localStorage.getItem("auth_token");
  return Boolean(token);
}

