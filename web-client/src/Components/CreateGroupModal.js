import styled from "styled-components";
import Avatar from "../Components/Avatar";
import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createNewConversation, modifyConversation } from "../redux/actions";
import { storage as firebaseStorage } from "../utils/firebase";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const CreateGroupModal = ({ onClose, conversation }) => {
  const authUser = useSelector((state) => state.auth.user);
  const [groupName, setGroupName] = useState(
    conversation?.conversationId.groupName || ""
  );
  const users = conversation?.conversationId.users.slice() || [authUser._id];
  const firebaseId = conversation?.conversationId.firebaseId || uuidv4();
  const imageRef = useRef();
  const phoneNumbers = [authUser.phoneNumber];
  const [groupPhotoURL, setGroupPhotoURL] = useState(
    conversation?.conversationId.groupPhotoURL ||
      "https://avatars.dicebear.com/api/jdenticon/spiral.svg"
  );

  const contacts = useSelector((state) => state.contacts.contacts);

  const dispatch = useDispatch();

  const onChangeHandler = async (e) => {
    setGroupName(document.getElementById("group-name").value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const groupName = document.getElementById("group-name").value.trim();
    if (!groupName) {
      return;
    }
    setGroupName((prevState) => groupName);

    for (let ele of e.target.getElementsByTagName("input")) {
      if (ele.type === "checkbox" && ele.checked) {
        phoneNumbers.push(contacts.find((c) => c._id === ele.id).phoneNumber);
        if (users.findIndex((u) => u === ele.id) === -1) {
          users.push(ele.id);
        }
      }
    }
    const sender = authUser._id;
    const conversationType = "group";

    const conversationData = {
      users,
      conversationType,
      groupName: groupName.trim(),
      groupPhotoURL,
      firebaseId,
      sender,
      phoneNumbers,
    };

    if (!conversation) dispatch(createNewConversation({ ...conversationData }));
    else {
      dispatch(
        modifyConversation({
          ...conversationData,
          _id: conversation.conversationId._id,
        })
      );
    }
    onClose();
  };
  const imageUploadHandler = () => {
    imageRef.current.click();
  };
  const onImageSelectHandler = () => {
    const extension = imageRef.current.files[0].type.split("/")[1];
    const storageRef = ref(
      firebaseStorage,
      `images/${firebaseId}.${extension}`
    );
    uploadBytes(storageRef, imageRef.current.files[0]).then((snapshot) => {
      getDownloadURL(storageRef).then(async (url) => {
        setGroupPhotoURL((prevState) => url);
      });
    });
  };
  return (
    <>
      <Backdrop onClick={onClose}></Backdrop>
      <Overlay onSubmit={onSubmitHandler}>
        <div className="label">Create a group</div>

        <Avatar
          src={groupPhotoURL}
          size="200px"
          className="photo"
          onClick={imageUploadHandler}
        />
        <input
          type="file"
          ref={imageRef}
          hidden={true}
          accept="image/png, image/jpeg"
          onChange={onImageSelectHandler}
        />
        <div className="label">Group Name</div>
        <StyledInput
          placeholder="enter group name"
          id="group-name"
          value={groupName}
          onChange={onChangeHandler}
        />
        <div className="label">Contacts</div>
        <Friends>
          {contacts.map((c) => (
            <div key={c._id} className="listItem">
              <div className="details">
                <span className="name">{c.displayName}</span>
                <span className="phone">{c.phoneNumber}</span>
              </div>
              <input
                type="checkbox"
                id={c._id}
                defaultChecked={
                  users.findIndex((u) => u === c._id.toString()) > -1
                }
                disabled={users.findIndex((u) => u === c._id.toString()) > -1}
              />
            </div>
          ))}
        </Friends>
        <button type="submit">
          {conversation ? "Update" : "Create"} Group
        </button>
      </Overlay>
    </>
  );
};

export default CreateGroupModal;

const Backdrop = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #00000080;
  position: fixed;
  top: 0;
  left: 0;
`;

const Overlay = styled.form`
  position: absolute;
  top: 10%;
  left: 40%;
  width: 30%;

  background-color: #06505133;
  padding: 10px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;

  .photo {
    border: 1px solid #065051;
    margin: 20px 0;
  }

  .label {
    color: white;
  }

  .listItem {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #065051;
    padding: 10px;
    align-items: center;
  }

  .details {
    display: flex;
    flex-direction: column;
  }

  .phone {
    font-size: x-small;
    font-style: italic;
  }
`;

const StyledInput = styled.input`
  background: none;
  outline: none;
  border: none;
  width: 50%;
  line-height: 2rem;
  color: white;
  padding: 0 10px;
  margin-bottom: 20px;
  flex-shrink: 0;
  margin-top: 10px;

  border-bottom: 1px solid #065051;
  &::placeholder {
    color: #ffffff80;
  }
`;

const Friends = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  border: 1px solid #065051;
  padding: 10px;
  margin-top: 10px;
  color: white;
  height: 30vh;
  overflow-y: auto;
`;
