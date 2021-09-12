import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import SendIcon from "@material-ui/icons/Send";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { sendMessage } from "../redux/actions";

const colorizeIcon = (Component) => {
  return <Component style={{ color: "#B1B3B5" }} />;
};
const MessageInput = () => {
  const messageInputRef = useRef("");
  const authUserId = useSelector((state) => state.auth.user._id);
  const conversationId = useSelector(
    (state) => state.conversations.currentConversation
  );
  const dispatch = useDispatch();
  const sendMessageHandler = (e) => {
    e.preventDefault();
    const enteredText = messageInputRef.current.value.trim();
    if (enteredText) {
      const message = {
        _id: uuidv4(),
        content: enteredText,
        senderId: authUserId,
        conversationId: conversationId,
        createdAt: Date.now(),
        status: "pending",
      };
      dispatch(
        sendMessage({
          conversationId,
          message,
        })
      );

      messageInputRef.current.value = "";
    }
  };
  return (
    <MainContainer onSubmit={sendMessageHandler}>
      <IconButton>{colorizeIcon(InsertEmoticonIcon)}</IconButton>
      <InputContainer>
        <StyledInput placeholder="Type a message" ref={messageInputRef} />
      </InputContainer>
      <IconButton type="submit">{colorizeIcon(SendIcon)}</IconButton>
    </MainContainer>
  );
};

export default MessageInput;

const MainContainer = styled.form`
  height: 60px;
  width: 100%;
  background-color: #1e2428;
  display: flex;
  align-items: center;
`;

const InputContainer = styled.div`
  height: 40px;
  flex: 1;
  border-radius: 20px;
  background-color: #33383b;
  display: flex;
  align-items: center;
  padding: 0 10px;
`;

const StyledInput = styled.input`
  outline: none;
  border: none;
  background: none;
  color: white;
  width: 100%;
  height: 100%;

  &::placeholder {
    color: white;
  }
`;
