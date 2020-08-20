import React from "react";
import styled from "styled-components";

export default class NotFound extends React.Component {
  render() {
    return (
      <Container>
        <NotFoundTitle>Uh oh, sepertinya kamu tersesat :(</NotFoundTitle>
      </Container>
    );
  }
}

const NotFoundTitle = styled.div`
  font-size: 2rem;
  color: white;
  margin: 1rem;
`;

const Container = styled.div`
  height: calc(100vh - 64px);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
