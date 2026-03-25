// src/config/roles.js

export const ROLES = {
  ADMIN: "admin",
  TRADER: "trader",
  CLIENT: "client",
  SUPPORT: "support",
  PUBLIC: "public",
};

export const PERMISSIONS = {
  VIEW_ADMIN: "view_admin",
  VIEW_TRADING: "view_trading",
  VIEW_ANALYTICS: "view_analytics",
  VIEW_PUBLIC: "view_public",
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_ADMIN,
    PERMISSIONS.VIEW_TRADING,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_PUBLIC,
  ],
  [ROLES.TRADER]: [
    PERMISSIONS.VIEW_TRADING,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_PUBLIC,
  ],
  [ROLES.CLIENT]: [
    PERMISSIONS.VIEW_TRADING,
    PERMISSIONS.VIEW_PUBLIC,
  ],
  [ROLES.SUPPORT]: [
    PERMISSIONS.VIEW_ADMIN,
    PERMISSIONS.VIEW_PUBLIC,
  ],
  [ROLES.PUBLIC]: [
    PERMISSIONS.VIEW_PUBLIC,
  ],
};

export function hasPermission(role, permission) {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes(permission);
}
