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
} from "../utilities/token.js";
import { generateKeys } from "../utilities/encryption.js";

/**
 *
 * @param {length of the required otp} length
 * @returns random number of given length
 */
const generateOTP = (length) => {
  const min = parseInt(1 + "0".repeat(length - 1));
  const multiplier = parseInt(9 + "0".repeat(length - 1));
  const otp = Math.floor(Math.random() * multiplier) + min;
  return otp;
};

/**
 *
 * @param {*} req
 * @param {*} res
 * creates otp and tokens and sends back the response
 */
export const login = async (req, res) => {
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
  const accessToken = createAccessToken(phoneNumber);
  const refreshToken = createRefreshToken(phoneNumber);
  let publicKey;
  // ~~~~~~ update in Auth collection ~~~~~~ //

  const existingUser = await Auth.findOne({ phoneNumber });
  if (existingUser) {
    await existingUser.updateOne({ otp, refreshToken });
    publicKey = existingUser.publicKey;
  } else {
    const { publicKey, privateKey } = generateKeys();
    await Auth.create({
      phoneNumber,
      otp,
      refreshToken,
      publicKey,
      privateKey,
    });
  }
  console.log(otp);
  console.log(accessToken);
  console.log(publicKey);
  res.status(200).send({
    phoneNumber,
    accessToken,
    refreshToken,
    otp,
    publicKey,
  });
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
  if (phoneNumber !== req.phoneNumber)
    throw new AuthenticationError(
      "ERR_INVALID_TOKEN",
      "The access token is not for the given phoneNumber"
    );
  const authUser = await Auth.findOne({ phoneNumber });
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

  const photoURL = `https://avatars.dicebear.com/api/jdenticon/${phoneNumber}.svg`;
  let user = await User.findOne({ phoneNumber });
  if (!user)
    user = await User.create({
      phoneNumber,
      photoURL,
      status: "online",
    });

  return res.status(200).json(user);
};
