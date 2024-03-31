import { apiClient } from "./constants";

export const userLoginRequest = async ({ email, password }) => {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
};

export const userRegisterRequest = async ({
  name,
  email,
  password,
  is_mahe,
  regno,
}) => {
  const response = await apiClient.post("/auth/register", {
    name,
    email,
    password,
    is_mahe,
    regno,
  });
  return response.data;
};

export const checkUserLoginStatus = async ({ sid }) => {
  const response = await apiClient.get(
    "/auth/status",
    sid && {
      headers: {
        Cookie: `sid=${sid}`,
      },
    }
  );

  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.get("/auth/logout");
  return response.data;
};
