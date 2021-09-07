import styled from "styled-components";
import Avatar from "./Avatar";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";

const colorizeIcon = (Component) => {
  return <Component style={{ color: "#B1B3B5" }} />;
};

const BodyHeader = () => {
  return (
    <HeaderContainer>
      <Avatar
        mr="10px"
        src="https://images.unsplash.com/photo-1630261234647-ac2d4b955f59?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
      />
      <div className="details">
        <span>Regina Phalange</span>
        <span className="status">Online</span>
      </div>
      <div className="actions">
        <IconButton>{colorizeIcon(SearchIcon)}</IconButton>
        <IconButton>{colorizeIcon(MoreVertIcon)}</IconButton>
      </div>
    </HeaderContainer>
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
