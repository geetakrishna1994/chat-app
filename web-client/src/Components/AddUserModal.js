import styled from "styled-components";
import Avatar from "../Components/Avatar";
import { keyframes } from "styled-components";
import { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import { searchUser } from "../utils/apiCalls/user";
import { useSelector, useDispatch } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import { setCurrentConversation } from "../redux/conversationSlice";
import { createNewConversation } from "../redux/actions";
const colorizeIcon = (Component) => {
  return <Component style={{ color: "#B1B3B5" }} />;
};

const AddUserModal = ({ onClose }) => {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [user, setUser] = useState(null);
  const contacts = useSelector((state) => state.contacts.contacts);
  const conversations = useSelector(
    (state) => state.conversations.conversations
  );
  const authUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const onChangeHandler = async (e) => {
    const enteredText = e.target.value.replace(/[^0-9]/, "");
    if (enteredText.length <= 10) {
      setPhoneNumber((prevState) => enteredText);
      setIsDataLoaded((prevState) => {
        return false;
      });
      setUser(null);
    }

    if (enteredText.length === 10 && enteredText !== authUser.phoneNumber) {
      const searchedUser = await searchUser(enteredText);
      setIsDataLoaded(true);
      setUser(searchedUser);
    }
  };

  const onAddUser = () => {
    const index = contacts.findIndex((c) => c._id === user._id);
    if (index > -1) {
      const conversation = conversations.find(
        (c) => c.recipientId === user._id
      );
      const selectedConversationId = conversation.conversationId._id;
      dispatch(setCurrentConversation(selectedConversationId));
    } else {
      dispatch(
        createNewConversation({
          users: [authUser._id, user._id],
          sender: authUser._id,
          conversationType: "private",
          phoneNumbers: [authUser.phoneNumber, user.phoneNumber],
        })
      );
    }
    onClose();
  };
  return (
    <>
      <Backdrop onClick={onClose}></Backdrop>
      <Overlay>
        <StyledInput
          placeholder="enter the phone number"
          value={phoneNumber}
          onChange={onChangeHandler}
        />
        <StyledDivider />
        <User>
          {isDataLoaded ? (
            user && <Avatar mr="10px" src={user?.photoURL} />
          ) : (
            <div className="img-placeholder animate"></div>
          )}

          <div className="container">
            <span className={`name ${!isDataLoaded && "animate"}`}>
              {isDataLoaded && (user ? user?.displayName : "No user found")}
            </span>
            <span className={`phoneNumber ${!isDataLoaded && "animate"}`}>
              {user?.phoneNumber}
            </span>
            <span className={`about ${!isDataLoaded && "animate"}`}>
              {user?.about}
            </span>
          </div>
          {isDataLoaded && user && (
            <IconButton onClick={onAddUser} className="button">
              {colorizeIcon(AddIcon)}
            </IconButton>
          )}
        </User>
      </Overlay>
    </>
  );
};

export default AddUserModal;

const Backdrop = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #00000080;
  position: fixed;
  top: 0;
  left: 0;
`;

const Overlay = styled.div`
  position: absolute;
  top: 30%;
  left: 40%;
  width: 30%;

  background-color: #065051;
  padding: 10px;
  z-index: 10;
`;

const StyledInput = styled.input`
  background: rgba(0, 0, 0, 0.8);
  outline: none;
  border: none;
  width: 100%;
  line-height: 2rem;
  color: white;
  padding: 0 10px;
  margin-bottom: 10px;
  /* border-bottom: 1px solid #065051; */
  &::placeholder {
    color: white;
  }
`;

const StyledDivider = styled.hr`
  border-color: #065051;
  margin-bottom: 10px;
`;

const skeleton = keyframes`
0% {
    background-color: #121212;
}

100% {
    background-color: #aaa;
}
`;

const User = styled.div`
  /* background-color: rgba(0, 0, 0, 0.9); */
  padding: 10px;
  display: flex;
  height: 70px;
  align-items: center;
  width: 100%;
  .img-placeholder {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
    flex-shrink: 0;
  }

  .animate {
    background: #121212;
    animation: ${skeleton} 2s linear infinite alternate;
  }

  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-evenly;
    flex: 1;
  }
  & span {
    width: 100px;
    height: 10px;
    color: white;
    text-transform: capitalize;
    font-size: x-small;
  }

  .name {
    width: 50%;
  }

  .about {
    width: 100%;
  }
  .button {
    flex-shrink: 1;
    width: 30px;
  }
`;
