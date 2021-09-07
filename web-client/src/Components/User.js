import styled from "styled-components";
import Avatar from "./Avatar";
const User = ({ user }) => {
  return (
    <UserContainer>
      <Avatar src={user.photoURL} size="50px" mr="10px" />
      <div className="userDetails">
        <span className="userDetails__name">{user.displayName}</span>
        <span className="userDetails__about">
          <b>About : </b>
          {user.about}
        </span>
      </div>
    </UserContainer>
  );
};

export default User;

const UserContainer = styled.div`
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

  .userDetails {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    border-bottom: 1px solid #242d32;
    color: white;
    justify-content: center;
  }
  & .userDetails__name {
    color: white;
    text-transform: capitalize;
  }

  & .userDetails__about {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 300;
    font-style: italic;
    font-size: 0.8rem;
  }
`;
