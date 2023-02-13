import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  line-height: 2em;
`;

export const GetHome = () => {
  return (
    <Wrapper>
      <Link to="detail/documents/43/openings/17">
        Textannoviz – Globalise document 43
      </Link>{" "}
      <br />
      <Link to="detail/documents/199/openings/19">
        Textannoviz – Globalise document 199
      </Link>{" "}
      <br />
      <Link to="detail/documents/316_1/openings/19">
        Textannoviz – Globalise document 316_1
      </Link>{" "}
      <br />
      <Link to="detail/documents/316_2/openings/48">
        Textannoviz – Globalise document 316_2
      </Link>{" "}
      <br />
      <Link to="detail/documents/316_3/openings/52">
        Textannoviz – Globalise document 316_3
      </Link>{" "}
      <br />
      <Link to="detail/documents/405/openings/115">
        Textannoviz – Globalise document 405
      </Link>{" "}
      <br />
      <Link to="detail/documents/685_1/openings/77">
        Textannoviz – Globalise document 685_1
      </Link>{" "}
      <br />
      <Link to="detail/documents/685_2/openings/183">
        Textannoviz – Globalise document 685_2
      </Link>
    </Wrapper>
  );
};
