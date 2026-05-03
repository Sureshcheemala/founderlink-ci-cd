import API from "./api";

export const inviteCofounder = (data) =>
  API.post("/teams/invite", data);

export const acceptInvite = (id) =>
  API.put(`/teams/invite/${id}/accept`);

export const rejectInvite = (id) =>
  API.put(`/teams/invite/${id}/reject`);

export const requestToJoin = (data) =>
  API.post("/teams/join", data);

export const getStartupRequests = (startupId) =>
  API.get(`/teams/requests/${startupId}`);

export const acceptRequest = (id) =>
  API.put(`/teams/request/${id}/accept`);

export const rejectRequest = (id) =>
  API.put(`/teams/request/${id}/reject`);

export const getTeam = (startupId) =>
  API.get(`/teams/startup/${startupId}`);

export const getMyRequests = () =>
  API.get(`/teams/requests/me`);