import Joi from "joi";

const phoneNumber = Joi.string()
  .length(10)
  .pattern(/^[0-9]+$/)
  .required();

export const loginSchema = Joi.object({
  phoneNumber: phoneNumber,
}).required();

export const verifyOtpSchema = Joi.object({
  phoneNumber: phoneNumber,
  otp: Joi.string()
    .length(parseInt(process.env.OTP_LENGTH))
    .pattern(/^[0-9]+$/)
    .required(),
}).required();
