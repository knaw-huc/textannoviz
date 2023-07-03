import styled from "styled-components";

const MiradorStyled = styled.div`
  position: relative;
  width: 30%;
  flex-grow: 1;
  align-self: stretch;
  max-height: 100vh;
  top: 0px;
`;
export function Mirador() {
  return <MiradorStyled id="mirador" />;
}
