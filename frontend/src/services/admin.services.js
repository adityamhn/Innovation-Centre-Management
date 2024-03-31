import { apiClient } from "./constants";

export const sendAdminLoginRequest = async ({ email, password }) => {
  const response = await apiClient.post("/admin/login", { email, password });
  return response.data;
};
