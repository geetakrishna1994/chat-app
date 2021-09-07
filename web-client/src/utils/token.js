export const getRefreshToken = () => {
  const refreshToken = localStorage.getItem("refresh-token");
  return refreshToken;
};

export const setRefreshToken = (refreshToken) => {
  localStorage.setItem("refresh-token", refreshToken);
};

export const getAccessToken = () => {
  const token = localStorage.getItem("access-token");
  return token;
};

export const setAccessToken = (token) => {
  localStorage.setItem("access-token", token);
};
