import styled from "styled-components";
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import { getTimeString } from "../utils/date";
import { useDispatch } from "react-redux";
import { setCurrentConversation } from "../redux/conversationSlice";
import MessageStatus from "./MessageStatus";

const Conversation = ({ conversation }) => {
  let displayPicture, displayName;
  const contacts = useSelector((state) => state.contacts.contacts);
  const authUser = useSelector((state) => state.auth.user);
  // ====================================================== //
  // ======= get photo and name of each conversation ====== //
  // ====================================================== //
  if (conversation.conversationId.conversationType === "private") {
    const recipient = contacts.find(
      (con) => con._id === conversation.recipientId
    );
    displayPicture = recipient.photoURL;
    displayName = recipient.displayName;
  } else if (conversation.conversationId.conversationType === "group") {
    displayPicture = conversation.conversationId.groupPhotoURL;
    displayName = conversation.conversationId.groupName;
  } else {
    displayPicture =
      "https://images.unsplash.com/photo-1630261234647-ac2d4b955f59?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80";
    displayName = "Regina Phalange";
  }

  const messages = conversation.conversationId.messages;
  const unreadCount =
    messages.length > 0
      ? messages.reduce((prev, curr) => {
          if (
            curr.senderId.toString() !== authUser._id.toString() &&
            curr.readBy.findIndex((r) => {
              return r.userId.toString() === authUser._id.toString();
            }) === -1
          )
            return parseInt(prev) + 1;
          else return parseInt(prev);
        }, 0)
      : 0;

  const lastMessage = messages[messages.length - 1];
  const dispatch = useDispatch();
  const openConversationHandler = () => {
    dispatch(setCurrentConversation(conversation.conversationId._id));
  };
  const ownMessage = lastMessage?.senderId === authUser._id;
  return (
    <ConversationContainer onClick={openConversationHandler}>
      <Avatar src={displayPicture} size="50px" mr="10px" />
      <RightContainer>
        <div>
          <span className="name">{displayName}</span>
          <span className="time">
            {getTimeString(
              lastMessage?.createdAt || conversation.conversationId.createdAt
            )}
          </span>
          <span className="content-container">
            <span>
              {lastMessage && ownMessage && (
                <MessageStatus message={lastMessage} />
              )}
            </span>
            <span className="message">{lastMessage?.content}</span>
          </span>
          <span className={`count ${unreadCount === 0 ? "invisible" : ""}`}>
            {unreadCount}
          </span>
        </div>
      </RightContainer>
    </ConversationContainer>
  );
};

export default Conversation;

const ConversationContainer = styled.div`
  height: 70px;
  width: 100%;
  background-color: #131c21;
  align-items: center;
  display: flex;
  padding: 0 5px;
  flex-shrink: 0;

  &:hover {
    background-color: #2d3134;
    cursor: pointer;
  }
`;

const RightContainer = styled.div`
  flex: 1;
  height: 100%;
  border-bottom: 1px solid #242d32;
  color: #b1b3b5;
  display: flex;
  align-items: center;
  width: 100%;

  & > div {
    flex: 1;
    display: grid;
    grid-template-columns: 80% 20%;
    grid-template-rows: 20px 20px;
    grid-row-gap: 5px;
  }
  & .name {
    color: white;
    text-transform: capitalize;
  }

  & .time {
    color: #00af9c;
    text-align: center;
    justify-self: center;
    font-size: x-small;
  }

  & .content-container {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    align-items: flex-start;
  }

  & .message {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 300;
    font-style: italic;
    font-size: 0.8rem;
    /* display: flex; */
    align-items: center;
  }

  & .count {
    padding: 1px;
    background-color: #00af9c;
    border-radius: 15px;
    color: black;
    width: fit-content;
    min-width: 20px;
    text-align: center;
    justify-self: center;
    align-self: center;
    font-size: 0.75rem;
  }

  .invisible {
    visibility: hidden;
  }
`;
