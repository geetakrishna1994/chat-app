import styled from "styled-components";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { markMessageRead } from "../redux/actions";
import MessageStatus from "./MessageStatus";
const Message = ({ own, message }) => {
  const authUserId = useSelector((state) => state.auth.user._id);
  const dispatch = useDispatch();
  useEffect(() => {
    if (
      message.readBy?.findIndex((r) => r.userId === authUserId) === -1 &&
      message.senderId !== authUserId
    ) {
      dispatch(markMessageRead(message._id));
    }
  }, [authUserId, message.readBy, message.senderId, message._id, dispatch]);
  return (
    <MessageContainer own={own}>
      <span className="content">{message.content}</span>
      <span className="meta">
        <span>
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        {own && (
          <span>
            <MessageStatus message={message} />
          </span>
        )}
      </span>
    </MessageContainer>
  );
};

export default Message;

const MessageContainer = styled.div`
  width: fit-content;
  padding: 5px;
  background-color: ${(props) => (props.own ? "#065051" : "#262D31")};
  color: white;
  align-self: ${(props) => (props.own ? "flex-end" : "flex-start")};
  max-width: 60%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 20px;
  padding: 10px;
  margin-bottom: 20px;
  & .content {
    align-self: flex-start;
    overflow-wrap: break-word;
    width: 100%;
  }
  & .meta {
    align-self: flex-end;
    font-size: 0.6rem;
    display: flex;
    align-items: center;
  }
`;
