import styled from "styled-components";
import Avatar from "./Avatar";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import { useSelector } from "react-redux";
import { useState } from "react";
import { createPortal } from "react-dom";
import CreateGroupModal from "./CreateGroupModal";
import { getTimeString } from "../utils/date";
const colorizeIcon = (Component) => {
  return <Component style={{ color: "#B1B3B5" }} />;
};

const BodyHeader = () => {
  const [isGroupAddModalOpen, setIsGroupAddModalOpen] = useState(false);
  const openGroupModal = () => setIsGroupAddModalOpen(true);
  const closeGroupModal = () => setIsGroupAddModalOpen(false);
  const currentConversation = useSelector((state) =>
    state.conversations.conversations.find(
      (c) => c.conversationId._id === state.conversations.currentConversation
    )
  );
  let displayPicture, displayName, recipient;
  const contacts = useSelector((state) => state.contacts.contacts);

  // ====================================================== //
  // ======= get photo and name of each conversation ====== //
  // ====================================================== //
  if (currentConversation.conversationId.conversationType === "private") {
    recipient = contacts.find(
      (con) => con._id === currentConversation.recipientId
    );
    displayPicture = recipient.photoURL;
    displayName = recipient.displayName;
  } else if (currentConversation.conversationId.conversationType === "group") {
    displayPicture = currentConversation.conversationId.groupPhotoURL;
    displayName = currentConversation.conversationId.groupName;
  } else {
    displayPicture =
      "https://images.unsplash.com/photo-1630261234647-ac2d4b955f59?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80";
    displayName = "Regina Phalange";
  }
  const status =
    recipient?.status === "offline"
      ? `Last Seen : ${getTimeString(recipient?.updatedAt)}`
      : recipient?.status;
  const modifyGroupHandler = () => {
    if (currentConversation.conversationId.conversationType === "group") {
      openGroupModal();
    }
  };
  return (
    <>
      {isGroupAddModalOpen &&
        createPortal(
          <CreateGroupModal
            onClose={closeGroupModal}
            conversation={currentConversation}
          />,
          document.getElementById("root-modal")
        )}
      <HeaderContainer>
        <Avatar mr="10px" src={displayPicture} onClick={modifyGroupHandler} />
        <div className="details">
          <span>{displayName}</span>
          {currentConversation.conversationId.conversationType ===
            "private" && <span className="status">{status}</span>}
        </div>
        <div className="actions">
          <IconButton>{colorizeIcon(SearchIcon)}</IconButton>
          <IconButton>{colorizeIcon(MoreVertIcon)}</IconButton>
        </div>
      </HeaderContainer>
    </>
  );
};

export default BodyHeader;

const HeaderContainer = styled.div`
  height: 60px;
  width: 100%;
  background-color: #2a2f32;
  display: flex;
  align-items: center;
  padding-left: 10px;
  justify-content: space-between;
  border-bottom: 2px solid #2d3134;

  & .actions {
    display: flex;
    align-items: center;
  }

  & .details {
    display: flex;
    flex-direction: column;
    flex: 1;
    color: white;
  }

  & .status {
    font-size: 0.75rem;
  }
`;
