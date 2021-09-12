import Auth from "../models/Auth.js";
import User from "../models/User.js";
import { loginSchema, verifyOtpSchema } from "../utilities/schemas.js";
import {
  AuthenticationError,
  InvalidDataError,
  OTPError,
} from "../utilities/Errors.js";
import {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utilities/token.js";
import { generateKeys } from "../utilities/encryption.js";
import { _populateUser } from "./user.js";
import { generateOTP, sendOTP } from "../utilities/otp.js";
/**
 *
 * @param {length of the required otp} length
 * @returns random number of given length
 */

/**
 *
 * @param {*} req
 * @param {*} res
 * creates otp and tokens and sends back the response
 */
export const login = async (req, res) => {
  console.log("inside auth route");
  const data = req.body;

  const validationResult = loginSchema.validate(data);

  // ##################################################################### //
  // ################### Input data not in given format ################## //
  // ##################################################################### //
  if (validationResult.error) {
    throw new InvalidDataError(
      "phoneNumber",
      "ERR_INVALID_DATA",
      validationResult.error.details[0].message,
      validationResult.error
    );
  }

  const { phoneNumber } = data;
  const otp = generateOTP(process.env.OTP_LENGTH);
  await sendOTP(phoneNumber, otp);

  const refreshToken = createRefreshToken(phoneNumber);
  // ~~~~~~ update in Auth collection ~~~~~~ //

  const existingUser = await Auth.findOne({ phoneNumber });
  if (existingUser) {
    await existingUser.updateOne({ otp, refreshToken });
  } else {
    await Auth.create({
      phoneNumber,
      otp,
      refreshToken,
    });
  }
  console.log(otp);

  res.status(200).send("ok");
};

export const verifyOTP = async (req, res) => {
  const validationResult = verifyOtpSchema.validate(req.body);

  // ~~ validate the input data structure ~~ //

  if (validationResult.error) {
    throw new InvalidDataError(
      "",
      "ERR_INVALID_DATA",
      validationResult.error.details,
      validationResult.error
    );
  }

  const { phoneNumber, otp } = req.body;
  const authUser = await Auth.findOne({ phoneNumber });
  if (phoneNumber.toString() !== authUser.phoneNumber.toString())
    throw new AuthenticationError(
      "ERR_INVALID_PHONE_NUMBER",
      "The access token is not for the given phoneNumber"
    );
  if (!authUser)
    throw new InvalidDataError(
      "phoneNumber",
      "ERR_INVALID_DATA",
      "phone number is not present"
    );

  if ((Date.now() - new Date(authUser.updatedAt)) / (1000 * 60) > 5)
    throw new OTPError(
      "ERR_OTP_EXPIRED",
      "otp has expired. its been more than 5 minutes"
    );
  else if (parseInt(otp) !== authUser.otp)
    throw new OTPError(
      "ERR_OTP_INVALID",
      "Otp is not valid. Please enter correct otp"
    );

  const accessToken = createAccessToken(phoneNumber);
  const photoURL = `https://avatars.dicebear.com/api/jdenticon/${phoneNumber}.svg`;
  let user = await User.findOne({ phoneNumber });
  if (!user) {
    user = await User.create({
      phoneNumber,
      photoURL,
      status: "online",
    });
  } else {
    const io = req.app.io;
    const socketMap = req.app.socketMap;
    await _populateUser(user, io, socketMap);
  }
  return res.status(200).json({
    accessToken: accessToken,
    refreshToken: authUser.refreshToken,
    user: user.toJSON(),
  });
};

export const getNewToken = (req, res) => {
  const { refreshToken } = req.query;
  const data = verifyRefreshToken(refreshToken);
  const newAccessToken = createAccessToken(data.phoneNumber);
  res.status(200).json({ accessToken: newAccessToken });
};
