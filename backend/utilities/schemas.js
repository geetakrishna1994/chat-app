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

export const conversationSchema = Joi.object({
  users: Joi.array().items(Joi.string()).required(),
  conversationType: Joi.string().valid("private", "group").required(),
  sender: Joi.string().required(),
  groupName: Joi.string(),
  groupPhotoURL: Joi.string(),
}).required();

export const messageSchema = Joi.object({
  conversationId: Joi.string().required(),
  content: Joi.string().required(),
  senderId: Joi.string().required(),
}).required();
