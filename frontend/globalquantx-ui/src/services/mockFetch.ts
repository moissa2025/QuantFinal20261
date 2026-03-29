export async function mockFetch(path: string) {
  if (path.includes("/system/health")) {
    const data = await import("../mocks/system_health.json");
    return data.default;
  }
  if (path.includes("/auth/users/summary")) {
    const data = await import("../mocks/users_summary.json");
    return data.default;
  }
  if (path.includes("/risk/exposures/summary")) {
    const data = await import("../mocks/risk_exposures_summary.json");
    return data.default;
  }
  if (path.includes("/risk/exposures")) {
    const data = await import("../mocks/risk_exposures.json");
    return data.default;
  }
  if (path.includes("/ledger/journal")) {
    const data = await import("../mocks/ledger_journal.json");
    return data.default;
  }
  return [];
}
