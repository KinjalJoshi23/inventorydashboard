const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request(path, options) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const getProducts = () => request("/products");

export const createProduct = (data) =>
  request("/products", { method: "POST", body: JSON.stringify(data) });

export const updateProduct = (id, data) =>
  request(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deleteProduct = (id) => request(`/products/${id}`, { method: "DELETE" });
