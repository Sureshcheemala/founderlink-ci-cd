import API from "./api";

export const invest = (data) =>
  API.post("/investments", data);

export const getMyInvestments = () =>
  API.get("/investments/me");

export const getInvestmentRequests = () =>
  API.get("/investments/requests");

export const getPendingInvestmentRequests = () =>
  API.get("/investments/requests/pending");

export const acceptRequest = (id) =>
  API.put(`/investments/${id}/accept-request`);

export const rejectRequest = (id) =>
  API.put(`/investments/${id}/reject-request`);

export const approveInvestment = (id) =>
  API.put(`/investments/${id}/approve`);

export const rejectInvestment = (id) =>
  API.put(`/investments/${id}/reject`);

export const getStartupInvestments = (startupId) =>
  API.get(`/investments/startup/${startupId}`);

export const requestFunding = (data) =>
  API.post("/investments/request", data);

export const getStartupFundingTotal = (startupId) =>
  API.get(`/investments/startup/${startupId}/total`);