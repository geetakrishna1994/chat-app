import appInstance from "./axios";

export const updateUserDetails = async (data) => {
  const response = await appInstance.request({
    method: "PUT",
    url: "/user/",
    data,
    useAuth: true,
  });

  if (response.ok) return response.data;
};

export const getUser = async () => {
  const response = await appInstance.request({
    method: "GET",
    url: "/user/",
    useAuth: true,
  });
  if (response.ok) return response.data;
  return null;
};

export const searchUser = async (phoneNumber) => {
  const response = await appInstance.request({
    method: "GET",
    url: `/user/${phoneNumber}`,
    useAuth: true,
  });
  if (response.ok) return response.data;
  return null;
};
