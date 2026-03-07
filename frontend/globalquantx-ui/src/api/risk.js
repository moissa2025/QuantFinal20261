import { apiClient } from "./client";

export function preTradeCheck(order) {
  return apiClient("/risk/pretrade", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

