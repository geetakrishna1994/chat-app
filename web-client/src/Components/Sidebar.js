import styled from "styled-components";
import SidebarHeader from "./SidebarHeader";
import SidebarSearch from "./SidebarSearch";
import Conversation from "./Conversation";
import UserDetails from "./UserDetails";
import { useState } from "react";
import User from "./User";

const Sidebar = ({ userDetails = false }) => {
  const [isUserDetailsOpen, setUserDetailsOpen] = useState(userDetails);
  const [searchedUser, setSearchedUser] = useState(null);
  const openUserDetails = () => setUserDetailsOpen(true);
  const closeUserDetails = () => setUserDetailsOpen(false);
  const onSearchHandler = (user) => {
    setSearchedUser(user);
  };
  return (
    <SidebarContainer>
      {isUserDetailsOpen && <UserDetails closeUserDetails={closeUserDetails} />}
      {!isUserDetailsOpen && (
        <>
          <SidebarHeader openUserDetails={openUserDetails} />
          <SidebarSearch
            onSearch={onSearchHandler}
            searchedUser={searchedUser}
          />
          <Conversations>
            <Conversation />
            {searchedUser && <User user={searchedUser} />}
          </Conversations>
        </>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;

const SidebarContainer = styled.div`
  height: 90%;
  width: 20%;
  background-color: #131c21;
  border-right: 1px solid #2d3134;
  display: flex;
  flex-direction: column;
`;

const Conversations = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
`;
