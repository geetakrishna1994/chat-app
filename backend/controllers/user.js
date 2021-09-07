import User from "../models/User.js";
import { InvalidDataError } from "../utilities/Errors.js";

export const getUserDetails = async (req, res) => {
  const user = await User.findOne({ phoneNumber: req.phoneNumber });
  if (!user) throw new InvalidDataError("phoneNumber", "ERR_USER_NOT_FOUND");

  return res.status(200).json(user);
};

export const getUserByPhoneNumber = async (req, res) => {
  const { phoneNumber } = req.params;
  const selectedUser = await User.findOne({ phoneNumber });
  if (!selectedUser)
    throw new InvalidDataError("phoneNumber", "ERR_USER_NOT_FOUND");
  return res.status(200).json(selectedUser);
};

export const getAllConversations = async (req, res) => {
  const user = await User.findOne({ phoneNumber: req.phoneNumber });
  if (!user) throw new InvalidDataError("phoneNumber", "ERR_USER_NOT_FOUND");
};
