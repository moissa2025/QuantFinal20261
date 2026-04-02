// src/config/navigationModel.js
import { PERMISSIONS } from "./roles";

export const NAV_SECTIONS = [
  {
    id: "admin",
    label: "Control Center",
    permission: PERMISSIONS.VIEW_ADMIN,
    items: [
      { id: "adm-dash", label: "Dashboard", path: "/adm/dash" },
      { id: "adm-led", label: "Ledger", path: "/adm/led" },
      { id: "adm-rsk", label: "Risk Center", path: "/adm/rsk" },
      { id: "adm-sys", label: "System", path: "/adm/sys" },
      { id: "adm-usr", label: "Users", path: "/adm/usr" },
    ],
  },

  {
    id: "trading",
    label: "Trading Desk",
    permission: PERMISSIONS.VIEW_TRADING,
    items: [
      { id: "app-mkt", label: "Market", path: "/app/mkt" },
      { id: "app-pos", label: "Positions", path: "/app/pos" },
      { id: "app-ord", label: "Order Entry", path: "/app/ord" },
      { id: "app-pfl", label: "Portfolio", path: "/app/pfl" },

      {
        id: "app-wal",
        label: "Wallet",
        path: "/wallet",
        icon: "wallet",
        keywords: "wallet money balance funds account deposit transfer",
      },
    ],
  },

  {
    id: "analytics",
    label: "Analytics Lab",
    permission: PERMISSIONS.VIEW_ANALYTICS,
    items: [
      { id: "adm-dec", label: "Alpha Decay", path: "/adm/alp/dec" },
      { id: "adm-map", label: "Liquidity Map", path: "/adm/liq/map" },
      { id: "adm-rep", label: "Execution Replay", path: "/adm/exe/rep" },
    ],
  },

  {
    id: "public",
    label: "Public Pages",
    permission: PERMISSIONS.VIEW_PUBLIC,
    items: [
      { id: "pub-lnd", label: "Home", path: "/pub/lnd" },
      { id: "pub-lgn", label: "Login", path: "/pub/lgn" },
      { id: "pub-lpr", label: "Legal Privacy", path: "/pub/lpr" },
      { id: "pub-ter", label: "Legal Terms", path: "/pub/ter" },
      { id: "pub-sup", label: "Support", path: "/pub/sup" },
    ],
  },
];

// ⭐ REQUIRED EXPORT — fixes Vite error
export const NAV_ITEMS_FLAT = NAV_SECTIONS.flatMap(section =>
  section.items.map(item => ({
    ...item,
    section: section.label,
    permission: section.permission,
  }))
);

