import axios from "axios";
import {
  getRefreshToken,
  setRefreshToken,
  setAccessToken,
  getAccessToken,
} from "./token";
const authInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL + "/auth",
});

export const login = async (number) => {
  const res = await authInstance.request({
    method: "POST",
    url: "/login",
    data: {
      phoneNumber: number,
    },
  });
  return res.status;
};

export const getNewToken = async () => {
  const refreshToken = await getRefreshToken();
  const res = await authInstance.request({
    method: "GET",
    url: "/new-token",
    params: { refreshToken },
  });
  if (res.status === 200) {
    await setAccessToken(res.data.token);
    return res.data.token;
  }
  return;
};

export const submitOtp = async ({ phoneNumber, otp }) => {
  const res = await authInstance.request({
    url: "/verify-otp",
    method: "POST",
    data: {
      otp,
      phoneNumber,
    },
    headers: {
      "content-type": "application/json",
    },
  });

  if (res.status === 200) {
    const { refreshToken, token } = res.data;
    setRefreshToken(refreshToken);
    setAccessToken(token);
    return res.data;
  }
};

// ############################################ //
// ############## user api calls ############## //
// ############################################ //

const userInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL + "/user",
});

userInstance.interceptors.request.use(
  async (config) => {
    let token = await getAccessToken();
    if (!token) {
      token = await getNewToken();
    }
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
    return config;
  },
  async (error) => {
    console.log(error);
  }
);

userInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("here");
    console.log(error.response.data);
    if (error.response.data.code === "ERR_ACCESS_TOKEN") {
      let token = await getNewToken();
      let { data, url, headers, method } = error.config;
      if (!data) data = "";

      console.log(error.request);
      const res = await userInstance.request({
        data: JSON.parse(data),
        url,
        headers,
        method,
      });
      return res;
    } else return error;
    // return error;
  }
);

export const getUser = async () => {
  const refreshToken = await getRefreshToken();
  if (refreshToken) {
    const res = await userInstance.request({
      method: "GET",
      url: "/details",
    });
    console.log(res);
    if (res.status === 200) return res.data.user;
    return;
  }
  return null;
};

export const updateDetails = async (data) => {
  const res = await userInstance.request({
    method: "POST",
    url: "/details",
    data: data,
  });
  return res.data.user;
};

export const searchUser = async (phoneNumber) => {
  const res = await userInstance.request({
    method: "GET",
    url: `/${phoneNumber}`,
  });
  console.log(res.data.user);
  if (res.status === 200) return res.data.user;
  return;
};
