import API from "./api";

export const register = (data) => API.post("/auth/register", data);

export const login = (data) => API.post("/auth/login", data);

export const refreshToken = (refreshToken) =>
  API.post("/auth/refresh", { refreshToken });

export const blockUser = (id) =>
  API.put(`/auth/admin/users/${id}/block`);