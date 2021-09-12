import { io } from "socket.io-client";
import { getAccessToken } from "../utils/token";
import Event from "events";

class SocketHandler extends Event {
  emitOnNewConversation(conversation, contact, creator) {
    this.emit("conversation/new", conversation, contact, creator);
  }
  emitOnUpdateConversation(conversation, creator) {
    this.emit("conversation/update", conversation, creator);
  }
  emitOnNewMessage(message) {
    this.emit("message/new", message);
  }
  emitOnUpdateMessage(messageId, conversationId, updateData) {
    this.emit("message/update", messageId, conversationId, updateData);
  }
  emitOnUpdateContact(phoneNumber, updateDetails) {
    this.emit("contact/update", phoneNumber, updateDetails);
  }

  emitOnMessageSent(messageId, conversationId, updateData) {
    this.emit("message/update", messageId, conversationId, updateData);
  }

  connect(conversations, contacts) {
    if (this.socket?.connected) this.socket.close();

    this.socket = io(process.env.REACT_APP_SERVER_URL, {
      autoConnect: false,
      auth: {
        token: getAccessToken(),
      },
    });

    this.socket.on("connect_error", (err) => {
      console.log(err.message === "Error in token authentication");
      if (err.message === "Error in token authentication") {
        console.log(this.socket.connected);
        console.log();
      }
    });

    this.socket.on("conversation/new", (data) => {
      const { conversation, contact, creator } = data;
      this.emitOnNewConversation(conversation, contact, creator);
    });

    this.socket.on("conversation/update", (data) => {
      const { conversation, creator } = data;
      this.emitOnUpdateConversation(conversation, creator);
    });

    this.socket.on("message/new", (message) => {
      this.emitOnNewMessage(message);
      this.updateMessage(message._id, "delivered");
    });

    this.socket.on("message/update", (message, status) => {
      let update = {};
      if (status === "delivered") update = { deliveredTo: message.deliveredTo };
      else if (status === "read") {
        update = { readBy: message.readBy };
      }
      this.emitOnUpdateMessage(message._id, message.conversationId, update);
    });
    this.socket.connect();
    contacts.map((c) => this.setNewContactListener(c.phoneNumber));
  }

  setNewContactListener(phoneNumber) {
    this.socket.on(phoneNumber, (updateDetails) => {
      this.emitOnUpdateContact(phoneNumber, updateDetails);
    });
  }

  sendMessage(message) {
    this.socket.emit("message/new", message, () => {
      this.emitOnMessageSent(message._id, message.conversationId, {
        status: "sent",
      });
    });
  }

  updateMessage(messageId, status) {
    this.socket.emit("message/update", {
      id: messageId,
      status,
    });
  }

  createNewConversation(data) {
    this.socket.emit("conversation/new", data);
  }

  updateConversation(data) {
    this.socket.emit("conversation/update", data);
  }

  logout() {
    this.socket.close();
  }
}

export default SocketHandler;
