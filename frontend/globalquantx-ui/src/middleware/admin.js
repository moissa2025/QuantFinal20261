export function isAdmin() {
  const role = localStorage.getItem("user_role");
  return role === "admin";
}

