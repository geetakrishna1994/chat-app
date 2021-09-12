import styled from "styled-components";
import BodyHeader from "./BodyHeader";
import MessageInput from "./MessageInput";
import Message from "./Message";
import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";

const Body = () => {
  const focusRef = useRef();
  useEffect(() => {
    if (focusRef.current)
      focusRef.current.scrollIntoView({ behavior: "smooth" });
  });

  const authUserId = useSelector((state) => state.auth.user._id);
  const currentConversation = useSelector((state) =>
    state.conversations.conversations.find(
      (c) => c.conversationId._id === state.conversations.currentConversation
    )
  );

  return (
    <BodyContainer>
      {currentConversation && (
        <>
          <BodyHeader />
          <MessageContainer>
            <>
              {currentConversation?.conversationId?.messages.map((m, index) => (
                <Message
                  key={m._id}
                  own={m.senderId === authUserId}
                  message={m}
                />
              ))}
              <div ref={focusRef}></div>
            </>
          </MessageContainer>
          <MessageInput />
        </>
      )}
    </BodyContainer>
  );
};

export default Body;

const BodyContainer = styled.div`
  height: 90%;
  width: 50%;
  background-color: #121212;
  display: flex;
  flex-direction: column;
`;

const MessageContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  width: 100%;
  padding: 20px 40px;
`;
