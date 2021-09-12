import { InvalidDataError } from "../utilities/Errors.js";
import Message from "../models/Message.js";
import { messageSchema } from "../utilities/schemas.js";

export const createMessage = async (req, res) => {
  const validationResult = messageSchema.validate(req.body);
  if (validationResult.error) {
    throw new InvalidDataError("", "ERR_INVALID_DATA", validationResult.error);
  }
  const newMessage = await Message.create(req.body);
  return res.status(200).json(newMessage);
};
