import { apiClient } from "./client";

export function getTickers() {
  return apiClient("/market/tickers");
}

export function getCandles(symbol, interval = "1m") {
  return apiClient(`/market/candles?symbol=${symbol}&interval=${interval}`);
}

