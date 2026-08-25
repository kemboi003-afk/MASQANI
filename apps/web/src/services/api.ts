const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type RequestOptions = RequestInit & {
  token?: string;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include"
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message ?? "MASQANI request failed");
  }

  return response.json() as Promise<T>;
}

export function createViewingRequest(propertyId: string, scheduledAt: string, token: string) {
  return apiRequest("/api/viewings", {
    method: "POST",
    token,
    body: JSON.stringify({ propertyId, scheduledAt })
  });
}

export function createCloudinarySignature(token: string) {
  return apiRequest<{
    timestamp: number;
    signature: string;
    apiKey: string;
    cloudName: string;
    folder: string;
  }>("/api/uploads/signature", {
    method: "POST",
    token
  });
}
