const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function createInstitutionalAccount(payload) {
  const res = await fetch(`${API_BASE_URL}/v1/onboarding/create-account`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create account");
  }

  return res.json();
}

