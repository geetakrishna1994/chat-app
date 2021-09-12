import styled from "styled-components";
import Sidebar from "./Sidebar";
import Body from "./Body";
import { useLayoutEffect } from "react";
import { getUser } from "../utils/apiCalls/user.js";
import { authStart } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import LoginPage from "./LoginPage";
import { getAuth, signInAnonymously } from "firebase/auth";
import { loginSuccess, loginFail } from "../redux/actions";
import { getRefreshToken } from "../utils/token";
const App = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const isLoading = useSelector((state) => state.auth.isLoading);

  //* runs only at the initial load to get the user
  useLayoutEffect(() => {
    if (getRefreshToken()) {
      dispatch(authStart());
      getUser().then((user) => {
        if (user) dispatch(loginSuccess(user));
        else dispatch(loginFail());
      });
      const auth = getAuth();
      signInAnonymously(auth);
    }
  }, [dispatch]);

  return (
    <>
      {/* If user exists */}
      {!isLoading && authUser && (
        <Background>
          <Sidebar userDetails={!authUser?.displayName} />
          <Body />
        </Background>
      )}

      {/* if no user */}
      {!isLoading && !authUser && <LoginPage />}
      {/* Loading */}
      {isLoading && <p style={{ color: "white" }}>Loading ... </p>}
    </>
  );
};

export default App;

const Background = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
`;
