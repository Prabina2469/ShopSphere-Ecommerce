const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function getTokens() {
  return {
    accessToken: localStorage.getItem("shopsphere_access_token"),
    refreshToken: localStorage.getItem("shopsphere_refresh_token"),
  };
}

function setTokens({ accessToken, refreshToken }) {
  if (accessToken) localStorage.setItem("shopsphere_access_token", accessToken);
  if (refreshToken) localStorage.setItem("shopsphere_refresh_token", refreshToken);
}

function clearTokens() {
  localStorage.removeItem("shopsphere_access_token");
  localStorage.removeItem("shopsphere_refresh_token");
  localStorage.removeItem("shopsphere_user");
}

async function parseErrorOrJson(response) {
  const text = await response.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { message: text };
  }
  if (!response.ok) {
    const message = body?.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.body = body;
    throw error;
  }
  return body;
}

/**
 * Core request helper. Automatically attaches the access token, and on a
 * 401 tries exactly once to refresh the token and replay the original
 * request before giving up and forcing a logout.
 */
async function request(path, { method = "GET", body, auth = false, retry = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const { accessToken } = getTokens();
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && auth && retry) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return request(path, { method, body, auth, retry: false });
    }
    clearTokens();
    window.location.href = "/login";
    throw new Error("Session expired. Please log in again.");
  }

  return parseErrorOrJson(response);
}

async function tryRefresh() {
  const { refreshToken } = getTokens();
  if (!refreshToken) return false;
  try {
    const data = await request("/api/auth/refresh", {
      method: "POST",
      body: { refreshToken },
      auth: false,
    });
    setTokens(data);
    return true;
  } catch {
    return false;
  }
}

export const api = {
  // ---- auth ----
  register: (payload) => request("/api/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/api/auth/login", { method: "POST", body: payload }),
  logout: () => request("/api/auth/logout", { method: "POST", auth: true }).catch(() => {}),

  // ---- products ----
  listProducts: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""))
    ).toString();
    return request(`/api/products${query ? `?${query}` : ""}`);
  },
  getProduct: (id) => request(`/api/products/${id}`),
  createProduct: (payload) => request("/api/products", { method: "POST", body: payload, auth: true }),
  updateProduct: (id, payload) => request(`/api/products/${id}`, { method: "PUT", body: payload, auth: true }),
  deleteProduct: (id) => request(`/api/products/${id}`, { method: "DELETE", auth: true }),
};

export { getTokens, setTokens, clearTokens };
