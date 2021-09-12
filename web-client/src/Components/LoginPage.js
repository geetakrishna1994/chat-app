import styled from "styled-components";
import { useState, useEffect } from "react";
import { login, verifyOTP } from "../utils/apiCalls/auth";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/actions";

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [cardHeight, setCardHeight] = useState("350px");
  const [buttonText, setButtonText] = useState("Get OTP");
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (isButtonDisabled) {
      const id = setTimeout(() => {
        setButtonText("Resend OTP");
        setIsButtonDisabled(false);
      }, 60 * 1000);
      return () => clearTimeout(id);
    }
  }, [isButtonDisabled]);

  const removeNonNumeric = (field, e) => {
    const enteredText = e.target.value.replace(/[^0-9]/, "");
    if (field === "phoneNumber") setPhoneNumber(enteredText);
    else setOtp(enteredText);
  };
  const getOtpHandler = async (e) => {
    e.preventDefault();
    setError("");
    const response = await login(phoneNumber);
    console.log(response);
    if (response.ok) {
      setCardHeight("600px");
      setIsButtonDisabled(true);
      setTimeout(() => {
        setIsOtpSent(true);
      }, 500);

      setButtonText("Resend OTP");
    } else {
      console.log(response.error);
      setError(response.error.code);
    }
  };
  const submitOtpHandler = async (e) => {
    e.preventDefault();
    setError("");
    const response = await verifyOTP(phoneNumber, otp);
    if (response.ok) {
      dispatch(loginSuccess(response.data));
    } else {
      console.log(response.error);
      setError(response.error.code);
    }
  };
  return (
    <Container>
      <Card height={cardHeight}>
        <span className="title"> Login </span>
        <form className="form" onSubmit={getOtpHandler}>
          <label className="label">Phone Number</label>
          <div className="inputDiv">
            <input
              type="text"
              maxLength={10}
              minLength={10}
              onChange={removeNonNumeric.bind(this, "phoneNumber")}
              value={phoneNumber}
            />
          </div>
          <StyledButton type="submit" disabled={isButtonDisabled}>
            {buttonText}
          </StyledButton>
        </form>
        {isOtpSent && (
          <form className="form" onSubmit={submitOtpHandler}>
            <label className="label">OTP</label>
            <div className="inputDiv">
              <input
                className="otp"
                type="text"
                maxLength={4}
                minLength={4}
                onChange={removeNonNumeric.bind(this, "otp")}
                value={otp}
              />
            </div>
            <button className="actionButton" type="submit">
              Login
            </button>
          </form>
        )}
        {error && <span className="error">{error}</span>}
      </Card>
    </Container>
  );
};

export default LoginPage;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  color: white;
  display: flex;
  justify-content: center;

  .title {
    font-size: 4rem;
    margin-bottom: 50px;
  }

  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 50px;
  }

  .inputDiv {
    display: flex;
    justify-content: center;
    padding-left: 10px;
    border-bottom: 1px solid #00af9c;
    width: fit-content;
  }

  & input {
    outline: none;
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    width: 200px;
  }

  & .otp {
    width: 100px;
  }

  .label {
    font-size: 1rem;
    margin-bottom: 20px;
  }
  .actionButton {
    background-color: #065051;
    border: none;
    padding: 10px 20px;
    color: white;
    margin-top: 20px;
    cursor: pointer;
  }

  .actionButton:hover {
    background-color: #00af9c;
  }

  .error {
    color: red;
  }
`;

const Card = styled.div`
  width: fit-content;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  flex-direction: column;
  height: fit-content;
  padding: 50px;
  margin-top: 100px;
  transition: all 1s cubic-bezier(0.075, 0.82, 0.165, 1);
  height: ${(props) => props.height};
`;

const StyledButton = styled.button`
  background-color: ${(props) => (props.disabled ? "gray" : "#065051")};
  border: none;
  padding: 10px 20px;
  color: white;
  margin-top: 20px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    background-color: ${(props) => (props.disabled ? "gray" : "#00af9c")};
  }
`;
