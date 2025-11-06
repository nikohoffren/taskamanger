const BASE_URL = "http://localhost:8000/api";

export async function verifyToken(token) {
  const response = await fetch("http://localhost:8000/api/token/verify/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  return response.ok;
}

export async function apiRequest(
  endpoint,
  method = "GET",
  body = null,
  token = null,
  onUnauthorized = null
) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${BASE_URL}/${endpoint}`, options);

  if (response.status === 401) {
    if (onUnauthorized) {
      onUnauthorized();
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Unauthorized");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Request failed");
  }

  return response.status === 204 ? null : response.json();
}
