import axios from "axios";
import { getAccessToken, setAccessToken, getRefreshToken } from "../token.js";

const appInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  headers: {
    "content-type": "application/json",
  },
});

appInstance.interceptors.request.use((config) => {
  const { useAuth, ...rest } = config;
  if (useAuth) {
    const accessToken = getAccessToken();
    rest.headers.authorization = `Bearer ${accessToken}`;
  }
  return rest;
});

appInstance.interceptors.response.use(
  (response) => {
    return {
      ok: true,
      data: response.data,
    };
  },
  async (error) => {
    if (error.response.data.code === "ERR_ACCESS_TOKEN_EXPIRED") {
      const accessToken = await getNewAccessToken();

      if (accessToken) {
        error.config.headers.authorization = `Bearer ${accessToken}`;
        if (error.config.method === "get")
          return await appInstance.request({
            ...error.config,
          });
        else
          return await appInstance.request({
            ...error.config,
            data: JSON.parse(error.config.data),
          });
      } else {
        return {
          error: "false",
          data: "ERR_REFRESH_TOKEN_EXPIRED",
        };
      }
    } else if (error.response.data.code === "ERR_REFRESH_TOKEN_EXPIRED") {
      console.log("refresh token expired");
      return {
        ok: false,
        data: error.response.data,
      };
      //TODO - refresh token expiry logic
    } else {
      return {
        ok: false,
        data: error.response.data,
      };
    }
  }
);

const getNewAccessToken = async () => {
  const refreshToken = getRefreshToken();
  const response = await appInstance.request({
    method: "GET",
    url: "/auth/new-token",
    params: { refreshToken },
  });
  if (response.ok) {
    setAccessToken(response.data.accessToken);
    return response.data.accessToken;
  }
  return null;
};

export default appInstance;
