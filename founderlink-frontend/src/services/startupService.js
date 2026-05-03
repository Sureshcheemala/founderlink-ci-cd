import API from "./api";

export const createStartup = (data) =>
  API.post("/startups", data);

export const getStartups = async (filters) => {
  const cleanedFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => {
      if (value === null) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      return true;
    })
  );

  const query = new URLSearchParams(cleanedFilters).toString();

  console.log("QUERY:", query); 

  return await API.get(`/startups?${query}`);
};

export const getMyStartups = () =>
  API.get("/startups/my");

export const getStartupById = (id) =>
  API.get(`/startups/${id}`);

export const updateStartup = (id, data) =>
  API.put(`/startups/${id}`, data);

export const deleteStartup = (id) =>
  API.delete(`/startups/${id}`);

export const followStartup = (id) =>
  API.post(`/startups/${id}/follow`);

export const getFollowedStartups = () =>
  API.get("/startups/followed");

export const approveStartup = (id) =>
  API.put(`/startups/approve/${id}`);

export const rejectStartup = (id) =>
  API.put(`/startups/reject/${id}`);