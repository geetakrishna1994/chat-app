import { conversationSchema } from "../utilities/schemas.js";
import { InvalidDataError } from "../utilities/Errors.js";
import Conversation from "../models/Conversation.js";

export const createConversation = async (req, res) => {
  const validationResult = conversationSchema.validate(req.body);
  if (validationResult.error) {
    throw new InvalidDataError("", "ERR_INVALID_DATA", validationResult.error);
  }

  const newConversation = await _createConversation(req.body);
  return res.status(200).json(newConversation);
};

export const _createConversation = async (data) => {
  const { users, conversationType, sender, groupName, groupPhotoURL } = data;
  let newConversation;
  if (conversationType === "private") {
    newConversation = await Conversation.create({
      users,
      conversationType,
    });
  } else {
    newConversation = await Conversation.create({
      users,
      conversationType,
      groupName,
      groupPhotoURL,
    });
  }

  return newConversation;
};
