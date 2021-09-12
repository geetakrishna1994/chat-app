import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Avatar from "./Avatar";
import EditTextField from "./EditTextField";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { ref } from "firebase/storage";
import { storage as firebaseStorage } from "../utils/firebase";
import { uploadBytes, getDownloadURL } from "firebase/storage";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/authSlice";
import { updateUserDetails } from "../utils/apiCalls/user.js";

const colorizeIcon = (Component) => {
  return <Component style={{ color: "#B1B3B5" }} />;
};

const UserDetails = ({ closeUserDetails }) => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const imageRef = useRef();

  const imageUploadHandler = () => {
    imageRef.current.click();
  };
  const onImageSelectHandler = () => {
    const extension = imageRef.current.files[0].type.split("/")[1];
    const storageRef = ref(
      firebaseStorage,
      `images/${authUser.phoneNumber}.${extension}`
    );
    uploadBytes(storageRef, imageRef.current.files[0]).then((snapshot) => {
      getDownloadURL(storageRef).then(async (url) => {
        const updatedUser = await updateUserDetails({ photoURL: url });
        dispatch(updateUser(updatedUser));
      });
    });
  };

  return (
    <MainContainer>
      <div className="header">
        <IconButton onClick={closeUserDetails}>
          {colorizeIcon(ArrowBackIcon)}
          <span className="heading">Profile</span>
        </IconButton>
      </div>
      <Avatar
        src={authUser.photoURL}
        size="200px"
        onClick={imageUploadHandler}
      />
      <input
        type="file"
        ref={imageRef}
        hidden={true}
        accept="image/png, image/jpeg"
        onChange={onImageSelectHandler}
      />
      <EditDetailsForm>
        <span className="label">Your Name</span>
        <EditTextField
          textValue={authUser.displayName || ""}
          fieldName="displayName"
        />

        <span className="label">About</span>
        <EditTextField textValue={authUser.about || ""} fieldName="about" />
      </EditDetailsForm>
    </MainContainer>
  );
};

export default UserDetails;

const MainContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .header {
    width: 100%;
    height: 100px;
    background-color: #323739;
    display: flex;
    align-items: flex-end;
    margin-bottom: 30px;
  }
  .heading {
    color: white;
    margin-left: 20px;
  }
`;

const EditDetailsForm = styled.div`
  height: 300px;
  width: 100%;
  padding: 0 20px;
  margin-top: 30px;
  display: flex;
  flex-direction: column;

  .label {
    color: #00af9c;
  }
`;
