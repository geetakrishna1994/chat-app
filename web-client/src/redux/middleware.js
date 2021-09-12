import { authEnd, reset as resetAuth } from "./authSlice";
import {
  setConversations,
  reset as resetConversations,
} from "./conversationSlice";

import {
  setContacts,
  updateContact,
  addContact,
  reset as resetContacts,
} from "./contactsSlice";
import {
  updateMessage,
  addMessage,
  addConversation,
  setCurrentConversation,
} from "./conversationSlice";
import SocketHandler from "../utils/socket.js";

const apiMiddleware = () => {
  let socket = new SocketHandler();

  return ({ dispatch, getState }) => {
    socket.on("contact/update", (phoneNumber, updateDetails) => {
      dispatch(updateContact({ phoneNumber, data: updateDetails }));
    });

    socket.on("conversation/new", (conversation, contact, creator) => {
      if (contact) dispatch(addContact(contact));
      dispatch(addConversation(conversation));
      if (creator.toString() === getState().auth.user._id.toString())
        dispatch(setCurrentConversation(conversation.conversationId._id));
    });

    socket.on("conversation/update", (conversation, creator) => {
      dispatch(addConversation(conversation));
      if (creator.toString() === getState().auth.user._id.toString())
        dispatch(setCurrentConversation(conversation.conversationId._id));
    });

    socket.on("message/new", (message) => {
      dispatch(addMessage({ conversationId: message.conversationId, message }));
    });

    socket.on("message/update", (messageId, conversationId, updateData) => {
      dispatch(
        updateMessage({
          conversationId,
          messageId,
          data: updateData,
        })
      );
    });
    return (next) => (action) => {
      if (action.type === "login/success") {
        const { conversations = [], contacts = [], ...rest } = action.payload;
        dispatch(authEnd(rest));
        dispatch(setContacts(contacts));
        dispatch(setConversations(conversations));

        socket.connect(conversations, contacts);

        return;
      }

      if (action.type === "login/fail") {
        dispatch(authEnd());
        return;
      }

      if (action.type === "message/send") {
        dispatch(addMessage(action.payload));
        const { status, ...rest } = action.payload.message;
        socket.sendMessage(rest);
        return;
      }

      if (action.type === "message/read") {
        socket.updateMessage(action.payload, "read");
        return;
      }

      if (action.type === "conversation/new") {
        socket.createNewConversation(action.payload);
        return;
      }

      if (action.type === "conversation/update") {
        socket.updateConversation(action.payload);
        return;
      }

      if (action.type === "logout") {
        socket.logout();
        dispatch(resetAuth());
        dispatch(resetContacts());
        dispatch(resetConversations());
        localStorage.clear();
      }
      return next(action);
    };
  };
};

export default apiMiddleware;
