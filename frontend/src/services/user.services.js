import { apiClient } from "./constants";

export const registerStartupRequest = async (body) => {
  const response = await apiClient.post("/user/register-startup", body);
  return response.data;
};

export const getStartup = async () => {
  const response = await apiClient.get("/user/startup");
  return response.data;
};

export const getUserProfile = async () => {
  const response = await apiClient.get("/user/profile");
  return response.data;
}

export const updateUserProfile = async (body) => {
  const response = await apiClient.post("/user/profile/update", body);
  return response.data;
}

export const requestWorkspace = async (body) => {
  const response = await apiClient.post("/user/workspace/request", body);
  return response.data;
}


export const getWorkspaceRequest = async() => {
  const response = await apiClient.get("/user/workspace/request");
  return response.data;
}