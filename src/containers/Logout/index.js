import React, { useEffect } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import { persistAuth } from "utils/auth";
import { SSO_UI_LOGOUT_URL } from "config";
import { setAuth } from "redux/modules/auth";
import { setLoading } from "redux/modules/appState";

function Logout() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAuth(null));
    dispatch(setLoading(true));
    persistAuth(null);
    window.location.replace(SSO_UI_LOGOUT_URL);
  }, [dispatch]);

  return (
    <Container>
      <h1>Please Wait...</h1>
    </Container>
  );
}

const Container = styled.div`
  height: calc(100vh - 64px);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Logout;
