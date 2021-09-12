import styled from "styled-components";
import SidebarHeader from "./SidebarHeader";
import SidebarSearch from "./SidebarSearch";
import Conversation from "./Conversation";
import UserDetails from "./UserDetails";
import { useState } from "react";
import { useSelector } from "react-redux";
import User from "./User";

const sort = (a, b) => {
  let aDate, bDate;
  if (a.conversationId.messages.length === 0)
    aDate = new Date(a.conversationId.createdAt);
  else {
    aDate = new Date(a.conversationId.messages.at(-1).createdAt);
  }
  if (b.conversationId.messages.length === 0)
    bDate = new Date(b.conversationId.createdAt);
  else {
    bDate = new Date(b.conversationId.messages.at(-1).createdAt);
  }
  return bDate - aDate;
};

const Sidebar = ({ userDetails = false }) => {
  const [isUserDetailsOpen, setUserDetailsOpen] = useState(userDetails);
  const [searchedUser, setSearchedUser] = useState(null);
  const openUserDetails = () => setUserDetailsOpen(true);
  const closeUserDetails = () => setUserDetailsOpen(false);
  const conversationList = useSelector(
    (state) => state.conversations.conversations
  ).slice();
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
            {conversationList.sort(sort).map((c) => (
              <Conversation conversation={c} key={c.conversationId._id} />
            ))}

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
