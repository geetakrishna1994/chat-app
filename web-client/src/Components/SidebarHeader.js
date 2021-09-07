import styled from "styled-components";
import Avatar from "./Avatar";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AddIcon from "@material-ui/icons/Add";
import { useSelector } from "react-redux";
const colorizeIcon = (Component) => {
  return <Component style={{ color: "#B1B3B5" }} />;
};

const SidebarHeader = ({ openUserDetails }) => {
  const authUser = useSelector((state) => state.auth.user);
  return (
    <HeaderContainer>
      <Avatar src={authUser.photoURL} onClick={openUserDetails} />
      <div className="userName">{authUser.displayName}</div>
      <IconButton>{colorizeIcon(AddIcon)}</IconButton>
      <IconButton>{colorizeIcon(MoreVertIcon)}</IconButton>
    </HeaderContainer>
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
