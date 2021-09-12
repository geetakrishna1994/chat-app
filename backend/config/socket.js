import { verifyAccessToken } from "../utilities/token.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import { _createConversation } from "../controllers/conversation.js";
const socketHandler = (io, socketMap) => {
  io.use(async (socket, next) => {
    try {
      const data = verifyAccessToken(socket.handshake.auth?.token);
      socket.phoneNumber = data.phoneNumber;
      const user = await User.findOne({ phoneNumber: data.phoneNumber });
      socket.userId = user._id.toString();
      next();
    } catch (err) {
      // console.log(err);
      next(err);
    }
  });
  io.on("connection", async (socket) => {
    socketMap.set(socket.phoneNumber, socket);
    console.log(
      `socket connected, id : ${socket.id} , phoneNumber : ${socket.phoneNumber}`
    );
    console.log(socketMap.keys());
    const updatedUser = await User.findByIdAndUpdate(
      socket.userId,
      {
        status: "online",
      },
      { new: true }
    );
    updatedUser.conversations.map((c) =>
      socket.join(c.conversationId.toString())
    );

    io.emit(socket.phoneNumber, {
      status: updatedUser.status,
      updatedAt: updatedUser.updatedAt,
    });

    socket.on("disconnect", async () => {
      console.log("disconnected : ", socket.phoneNumber);
      socketMap.delete(socket.phoneNumber.toString());
      const updatedUser = await User.findByIdAndUpdate(
        socket.userId,
        {
          status: "offline",
        },
        { new: true }
      );
      io.emit(socket.phoneNumber, {
        status: updatedUser.status,
        updatedAt: updatedUser.updatedAt,
      });
    });

    socket.on("join", (conversationIds) => {
      conversationIds.map((c) => socket.join(c));
    });

    socket.on("conversation/new", async (data) => {
      const { phoneNumbers, ...rest } = data;
      const newConversation = await _createConversation(rest);

      for (let phoneNumber of phoneNumbers) {
        let socket = socketMap.get(phoneNumber.toString());

        if (socket) {
          socket.join(newConversation._id.toString());
          if (newConversation.conversationType === "private") {
            const recipientId = newConversation.users.find(
              (u) => u.toString() !== socket.userId
            );
            let recipientUser = await User.findById(recipientId);
            socket.emit("conversation/new", {
              conversation: {
                conversationId: { ...newConversation.toJSON(), messages: [] },
                recipientId,
                unreadCount: 0,
              },
              contact: recipientUser.toJSON(),
              creator: data.sender,
            });
          } else {
            socket.emit("conversation/new", {
              conversation: {
                conversationId: { ...newConversation.toJSON(), messages: [] },
              },
              creator: data.sender,
            });
          }
        }
      }
    });

    socket.on("message/new", async (message, callback) => {
      const newMessage = await Message.create(message);
      callback();
      socket
        .to(message.conversationId.toString())
        .emit("message/new", newMessage);
    });

    socket.on("message/update", async (data) => {
      const { id, status } = data;

      let updatedMessage;
      if (status === "delivered") {
        updatedMessage = await Message.findByIdAndUpdate(
          id,
          {
            $push: {
              deliveredTo: { userId: socket.userId, deliveredAt: Date.now() },
            },
          },
          { new: true }
        );
      } else if (status === "read") {
        updatedMessage = await Message.findByIdAndUpdate(
          id,
          { $push: { readBy: { userId: socket.userId, readAt: Date.now() } } },
          { new: true }
        );
      }
      if (!updatedMessage) {
      } else
        io.to(updatedMessage.conversationId.toString()).emit(
          "message/update",
          updatedMessage,
          status
        );
    });

    socket.on("conversation/update", async (data) => {
      const { phoneNumbers, ...rest } = data;
      const { _id, ...update } = rest;

      const updatedConversation = await Conversation.findByIdAndUpdate(
        _id,
        update,
        {
          new: true,
        }
      );
      await updatedConversation.populate("messages");

      for (let phoneNumber of phoneNumbers) {
        let socket = socketMap.get(phoneNumber.toString());
        // console.log(socket);
        if (socket) {
          socket.join(updatedConversation._id.toString());

          socket.emit("conversation/update", {
            conversation: {
              conversationId: { ...updatedConversation.toJSON() },
            },
            creator: data.sender,
          });
        }
      }
    });
  });
};

export default socketHandler;
