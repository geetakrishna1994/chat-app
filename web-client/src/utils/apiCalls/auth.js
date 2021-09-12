import appInstance from "./axios.js";

import { setAccessToken, setRefreshToken } from "../token";

/**
 *
 * @param {*} phoneNumber
 * @returns true on successful login
 * store tokens in the local store
 */
export const login = async (phoneNumber) => {
  const response = await appInstance.request({
    method: "POST",
    url: "/auth/login",
    data: {
      phoneNumber,
    },
  });

  if (response.ok) {
    return {
      ok: true,
      error: "",
    };
  } else {
    return {
      ok: false,
      error: response.data,
    };
  }
};

export const verifyOTP = async (phoneNumber, otp) => {
  const response = await appInstance.request({
    method: "POST",
    url: "/auth/verify-otp",
    data: {
      phoneNumber,
      otp,
    },
    useAuth: true,
  });
  if (response.ok) {
    const { accessToken, refreshToken, user } = response.data;
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    return {
      ok: true,
      data: user,
    };
  }
  return {
    ok: false,
    error: response.data,
  };
};
