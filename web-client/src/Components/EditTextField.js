import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
import { updateDetails } from "../utils/apiCalls";
import { useDispatch } from "react-redux";
import { updateUser } from "../redux/authSlice";
import { useState } from "react";
const colorizeIcon = (Component) => {
  return <Component style={{ color: "#B1B3B5" }} />;
};

const EditTextField = ({ textValue, fieldName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [enteredText, setEnteredText] = useState(textValue);
  const dispatch = useDispatch();
  const startEditing = () => {
    setIsEditing(() => true);
  };
  const stopEditing = async () => {
    setIsEditing(() => false);
    console.log(enteredText);
    const updatedUser = await updateDetails({
      [fieldName]: enteredText.trim(),
    });
    dispatch(updateUser(updatedUser));
  };
  return (
    <StyledInput isActive={isEditing}>
      {!isEditing ? (
        <>
          <span className="content">{enteredText}</span>
          <IconButton onClick={startEditing}>
            {colorizeIcon(EditIcon)}
          </IconButton>
        </>
      ) : (
        <>
          <input
            autoFocus
            onChange={(e) => setEnteredText(e.target.value)}
            value={enteredText}
          />
          <IconButton onClick={stopEditing}>
            {colorizeIcon(DoneIcon)}
          </IconButton>
        </>
      )}
    </StyledInput>
  );
};

export default EditTextField;

const StyledInput = styled.div`
  border-bottom: 1px solid ${(props) => (props.isActive ? "#00AF9C" : "black")};
  margin: 20px 0 30px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 200ms;

  & input {
    border: none;
    background: none;
    outline: none;
    color: white;
    font: inherit;
  }

  .content {
    color: white;
  }
`;
