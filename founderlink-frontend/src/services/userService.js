import API from "./api";

export const createOrUpdateProfile = (data) =>
  API.post("/users/profile", data);

export const getProfile = () =>
  API.get("/users/profile");

export const getUserById = (id) =>
  API.get(`/users/${id}`);

export const getAllUsers = () =>
  API.get("/users/all");

export const searchUsers = (query) =>
  API.get(`/users/search?query=${query}`);