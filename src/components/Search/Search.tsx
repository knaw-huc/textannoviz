import { Link } from "react-router-dom";
import { FullTextFacet } from "reactions";
import styled from "styled-components";
import { createIndices } from "../../utils/createIndices";

const Wrapper = styled.div`
  line-height: 1.5em;
`;

export const Search = () => {
  const indices = createIndices(51, 532);

  const handleFullTextFacet = (value: string) => {
    console.log(value);
  };

  return (
    <Wrapper style={{ display: "inline" }}>
      <FullTextFacet valueHandler={handleFullTextFacet} />
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
