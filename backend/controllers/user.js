import User from "../models/User.js";
import Message from "../models/Message.js";
import { InvalidDataError } from "../utilities/Errors.js";

export const getUserDetails = async (req, res) => {
  const user = await User.findOne({ phoneNumber: req.phoneNumber });
  if (!user) throw new InvalidDataError("phoneNumber", "ERR_USER_NOT_FOUND");
  const io = req.app.get("io");
  const socketMap = req.app.get("socketMap");
  await _populateUser(user, io, socketMap);
  return res.status(200).json(user);
};

export const getUserByPhoneNumber = async (req, res) => {
  const { phoneNumber } = req.params;
  const selectedUser = await User.findOne({ phoneNumber });
  // if (!selectedUser)
  //   throw new InvalidDataError("phoneNumber", "ERR_USER_NOT_FOUND");
  return res.status(200).json(selectedUser);
};

export const updateUserDetails = async (req, res) => {
  const updatedUser = await User.findOneAndUpdate(
    { phoneNumber: req.phoneNumber },
    {
      ...req.body,
    },
    { new: true }
  );
  req.io
    .to(req.phoneNumber.toString())
    .emit("contact/update", updatedUser.toJson());
  res.status(200).json(updatedUser);
};

export const getAllConversations = async (req, res) => {
  const user = await User.findOne({ phoneNumber: req.phoneNumber });
  if (!user) throw new InvalidDataError("phoneNumber", "ERR_USER_NOT_FOUND");
};

export const _populateUser = async (user, io, socketMap) => {
  const conversationList = user.conversations.map((c) => c.conversationId);
  // ====================================================== //
  // ========= update messages status to delivered ======== //
  // ====================================================== //
  const ids = await Message.find(
    {
      conversationId: { $in: conversationList },
      "deliveredTo.userId": { $ne: user._id },
      senderId: { $ne: user._id },
    },
    { _id: 1 }
  );
  await Message.updateMany(
    {
      conversationId: { $in: conversationList },
      "deliveredTo.userId": { $ne: user._id },
      senderId: { $ne: user._id },
    },
    {
      $push: {
        deliveredTo: {
          userId: user._id,
          deliveredAt: Date.now(),
        },
      },
    }
  );

  const updatedMessages = await Message.find({
    _id: { $in: ids.map((e) => e._id) },
  });

  updatedMessages.map((m) => {
    io.to(m.conversationId.toString()).emit("message/update", m, "delivered");
  });

  await user.populate([
    {
      path: "conversations",
      populate: {
        path: "conversationId",
        ref: "Conversation",
        populate: {
          path: "messages",
        },
      },
    },
    {
      path: "contacts",
      select: "-conversations",
    },
  ]);
};
