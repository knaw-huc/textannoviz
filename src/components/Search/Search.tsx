import { FullTextFacet } from "reactions";
import styled from "styled-components";
import { SearchItem } from "./SearchItem";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  float: left;
`;

export const Search = () => {
  const handleFullTextFacet = (value: string) => {
    console.log(value);
  };

  return (
    <>
      <Wrapper style={{ display: "inline" }}>
        <FullTextFacet valueHandler={handleFullTextFacet} />
      </Wrapper>
      <SearchItem />
    </>
  );
};
