import { apiClient } from "./constants";

export const sendAdminLoginRequest = async ({ email, password }) => {
  const response = await apiClient.post("/admin/login", { email, password });
  return response.data;
};

export const getAllStartups = async () => {
  const response = await apiClient.get("/admin/startups");
  return response.data;
};

export const getStartup = async (id) => {
  const response = await apiClient.get(`/admin/startups/${id}`);
  return response.data;
};

export const updateStartupStatus = async ({ startupId, status, public_profile }) => {
  const response = await apiClient.post(`/admin/startups/${startupId}/update`, {
    status,
    public_profile,
  });
  return response.data;
};

export const getAllUsers = async () => {
  const response = await apiClient.get("/admin/users");
  return response.data;
};

export const getUser = async (id) => {
  const response = await apiClient.get(`/admin/users/${id}`);
  return response.data;
};

export const addNewWorkspace = async (body) => {
  const response = await apiClient.post("/admin/workspace/add", body);
  return response.data;
};

export const getAllWorkspaces = async () => {
  const response = await apiClient.get("/admin/workspace");
  return response.data;
}

export const updateWorkspace = async (body) => {
  const response = await apiClient.post("/admin/workspace/update", body);
  return response.data;
}

export const getAllWorkspaceRequests = async () => {
  const response = await apiClient.get("/admin/workspace/requests");
  return response.data;
}


export const changeWorkspaceRequestStatus = async ({ requestId, status }) => {
  const response = await apiClient.post(`/admin/workspace/requests/${requestId}/update`, {
    status,
  });
  return response.data;
}

export const allocateWorkspace = async (body) => {
  const response = await apiClient.post("/admin/workspace/allocate", body);
  return response.data;
}

export const getAllWorkspaceAllocations = async () => {
  const response = await apiClient.get("/admin/workspace/allocations");
  return response.data;
}

export const deleteAllocation = async (id) => {
  const response = await apiClient.post(`/admin/workspace/allocations/${id}/delete`);
  return response.data;
}