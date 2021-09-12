import styled from "styled-components";
import Avatar from "./Avatar";
import IconButton from "@material-ui/core/IconButton";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useState } from "react";
import AddUserModal from "./AddUserModal";
import { useSelector } from "react-redux";
import { createPortal } from "react-dom";
import CreateGroupModal from "./CreateGroupModal";
import { logout } from "../redux/actions";
import { useDispatch } from "react-redux";
const colorizeIcon = (Component) => {
  let size = "20px";
  if (Component === GroupAddIcon) size = "22px";
  return <Component style={{ color: "#B1B3B5", fontSize: size }} />;
};

const SidebarHeader = ({ openUserDetails }) => {
  const dispatch = useDispatch();
  const [isPersonAddModalOpen, setIsPersonAddModalOpen] = useState(false);
  const [isGroupAddModalOpen, setIsGroupAddModalOpen] = useState(false);
  const openPersonModal = () => setIsPersonAddModalOpen(true);
  const closePersonModal = () => setIsPersonAddModalOpen(false);
  const openGroupModal = () => setIsGroupAddModalOpen(true);
  const closeGroupModal = () => setIsGroupAddModalOpen(false);

  const authUser = useSelector((state) => state.auth.user);

  return (
    <>
      {isPersonAddModalOpen &&
        createPortal(
          <AddUserModal onClose={closePersonModal} />,
          document.getElementById("root-modal")
        )}
      {isGroupAddModalOpen &&
        createPortal(
          <CreateGroupModal onClose={closeGroupModal} />,
          document.getElementById("root-modal")
        )}
      <HeaderContainer>
        <Avatar src={authUser.photoURL} onClick={openUserDetails} />
        <div className="userName">{authUser.displayName}</div>
        <IconButton onClick={openPersonModal}>
          {colorizeIcon(PersonAddIcon)}
        </IconButton>
        <IconButton onClick={openGroupModal}>
          {colorizeIcon(GroupAddIcon)}
        </IconButton>
        <IconButton onClick={() => dispatch(logout())}>
          {colorizeIcon(ExitToAppIcon)}
        </IconButton>
      </HeaderContainer>
    </>
  );
};

export default SidebarHeader;

const HeaderContainer = styled.div`
  height: 60px;
  width: 100%;
  background-color: #2a2f32;
  display: flex;
  align-items: center;
  padding-left: 10px;
  justify-content: space-between;
  border-bottom: 2px solid #2d3134;

  .userName {
    color: white;
    flex: 1;
    margin-left: 20px;
    text-transform: capitalize;
  }
`;
