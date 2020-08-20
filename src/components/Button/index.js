import styled from "styled-components";

const intentStyle = {
  primary: {
    backgroundColor: "#F2994A",
    color: "white"
  },
  secondary: {
    backgroundColor: "#0000",
    color: "#F2994A"
  }
};

const Button = styled.button`
  height: 40px;
  background-color: ${({ intent }) =>
    intentStyle[intent || "primary"].backgroundColor};
  border: 2px solid #F2994A;
  padding: 8px 16px;
  color: ${({ intent }) => intentStyle[intent || "primary"].color};
  font-weight: bold;

  &:hover {
    background-color: #F2994A;
    color: white;
  }

  &:disabled {
    background-color: #4f4f4f;
    color: white;
    border-color: #4f4f4f;
  }

  width: ${({ width }) => (width ? `${width}px` : "100%")};
  text-transform: uppercase;
  transition: 0.25s background ease;
`;

export default Button;
