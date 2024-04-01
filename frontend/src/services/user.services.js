import { apiClient } from "./constants";

export const registerStartupRequest = async (body) => {
  const response = await apiClient.post("/user/register-startup", body);
  return response.data;
};

export const getStartup = async () => {
  const response = await apiClient.get("/user/startup");
  return response.data;
};