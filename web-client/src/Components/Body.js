import styled from "styled-components";
import BodyHeader from "./BodyHeader";
import MessageInput from "./MessageInput";
import Message from "./Message";
import { useRef, useEffect } from "react";
const Body = () => {
  const focusRef = useRef();
  useEffect(() => {
    focusRef.current.scrollIntoView({ behavior: "smooth" });
  }, []);
  return (
    <BodyContainer>
      <BodyHeader />
      <MessageContainer>
        <Message />
        <Message own={true} />
        <Message />
        <Message own={true} />
        <Message />
        <Message own={true} ref={focusRef} />'
      </MessageContainer>
      <MessageInput />
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
