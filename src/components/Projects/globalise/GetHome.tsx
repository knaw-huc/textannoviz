import { Link } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  line-height: 2em;
`;

export const GetHome = () => {
  return (
    <Wrapper>
      <Link to="detail/43/17">Textannoviz – Globalise document 43</Link> <br />
      <Link to="detail/199/19">Textannoviz – Globalise document 199</Link>{" "}
      <br />
      <Link to="detail/316_1/19">
        Textannoviz – Globalise document 316_1
      </Link>{" "}
      <br />
      <Link to="detail/316_2/48">
        Textannoviz – Globalise document 316_2
      </Link>{" "}
      <br />
      <Link to="detail/316_3/52">
        Textannoviz – Globalise document 316_3
      </Link>{" "}
      <br />
      <Link to="detail/405/115">Textannoviz – Globalise document 405</Link>{" "}
      <br />
      <Link to="detail/685_1/77">
        Textannoviz – Globalise document 685_1
      </Link>{" "}
      <br />
      <Link to="detail/685_2/183">Textannoviz – Globalise document 685_2</Link>
    </Wrapper>
  );
};
