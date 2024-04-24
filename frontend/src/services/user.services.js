import { apiClient } from "./constants";

export const registerStartupRequest = async (body) => {
  const response = await apiClient.post("/user/register-startup", body);
  return response.data;
};

export const getStartup = async () => {
  const response = await apiClient.get("/user/startup");
  return response.data;
};

export const updateStartup = async (body) => {
  const response = await apiClient.post("/user/startup/update", body);
  return response.data;
}

export const getPublicStartups = async () => {
  const response = await apiClient.get("/user/startup/public");
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

export const getWorkspaceAllocated = async() => {
  const response = await apiClient.get("/user/my-workspace");
  return response.data;
}

export const requestMentorship = async(body) => {
  const response = await apiClient.post("/user/mentorship/request", body);
  return response.data;
}

export const getUserMentorshipRequests = async() => {
  const response = await apiClient.get("/user/mentorship/request");
  return response.data;
}

export const getUserDashboard = async() => {
  const response = await apiClient.get("/user/dashboard");
  return response.data;
}