import jwt from "jsonwebtoken";
import { AuthenticationError } from "./Errors.js";
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;

export const createAccessToken = (phoneNumber) => {
  try {
    const token = jwt.sign({ phoneNumber }, accessTokenSecret, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME,
    });
    return token;
  } catch (err) {
    throw new AuthenticationError("ERR_CREATING_ACCESS_TOKEN", err);
  }
};

export const createRefreshToken = (phoneNumber) => {
  try {
    const token = jwt.sign({ phoneNumber }, refreshTokenSecret, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE_TIME,
    });
    return token;
  } catch (err) {
    throw new AuthenticationError("ERR_CREATING_REFRESH_TOKEN", err);
  }
};

export const verifyAccessToken = (token) => {
  try {
    const data = jwt.verify(token, accessTokenSecret);
    return data;
  } catch (err) {
    throw new AuthenticationError(err.name, err);
  }
};

export const verifyRefreshToken = (token) => {
  try {
    const data = jwt.verify(token, refreshTokenSecret);
    return data;
  } catch (err) {
    throw new AuthenticationError(err.name, err);
  }
};
