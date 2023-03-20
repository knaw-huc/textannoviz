import { Link } from "react-router-dom";
import styled from "styled-components";
import { createIndices } from "../../utils/createIndices";

const Wrapper = styled.div`
  line-height: 1.5em;
`;

export const Search = () => {
  const indices = createIndices(51, 532);
  console.log(indices);
  return (
    <Wrapper style={{ display: "inline" }}>
      {indices.map((index, key) => (
        <>
          <Link key={key} to={`/detail/1728/${index}`}>
            Scan {index}
          </Link>
          <br />
        </>
      ))}
    </Wrapper>
  );
};
