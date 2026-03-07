import { apiClient } from "./client";

export function placeOrder(order) {
  return apiClient("/trading/order", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

export function cancelOrder(orderId) {
  return apiClient(`/trading/order/${orderId}`, {
    method: "DELETE",
  });
}

export function getOpenOrders() {
  return apiClient("/trading/orders/open");
}

