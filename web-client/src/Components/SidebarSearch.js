import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import { useState } from "react";
import { searchUser } from "../utils/apiCalls";
const colorizeIcon = (Component) => {
  return <Component style={{ fontSize: 16, color: "#B1B3B5" }} />;
};
const SidebarSearch = ({ onSearch, searchedUser }) => {
  const [searchText, setSearchText] = useState("");
  const inputHandler = async (e) => {
    const enteredText = e.target.value;
    setSearchText(enteredText);
    if (searchedUser) onSearch(null);
    if (
      enteredText &&
      enteredText.trim() &&
      enteredText.trim().length === 10 &&
      enteredText.trim().match(/[^0-9]/) === null
    ) {
      const user = await searchUser(enteredText.trim());
      console.log(user);
      onSearch(user);
    }
  };
  return (
    <MainContainer>
      <SearchContainer>
        <IconButton>{colorizeIcon(SearchIcon)}</IconButton>
        <StyledInput
          placeholder="Search a chat"
          value={searchText}
          onChange={inputHandler}
        />
      </SearchContainer>
    </MainContainer>
  );
};

export default SidebarSearch;

const MainContainer = styled.div`
  height: 45px;
  width: 100%;
  background-color: #131c21;
  border-bottom: 1px solid #242d32;
  align-items: center;
  justify-content: center;
  display: flex;
`;

const SearchContainer = styled.div`
  height: 30px;
  width: 90%;
  background-color: #323739;
  border-radius: 15px;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  background: none;
  outline: none;
  border: none;
  color: #b1b3b5;
  width: 100%;
`;
