import React from "react";
import styled from "styled-components";

interface ButtonProps {
  children?: React.ReactNode;
  onClick: () => void;
}

const StyledButton = styled.button`
  background: #0d6efd;
  border-radius: 3px;
  border: none;
  color: white;
  padding: 5px;
  margin-right: 0.5em;
`;

export const Button = (props: ButtonProps) => {
  return <StyledButton onClick={props.onClick}>{props.children}</StyledButton>;
};
