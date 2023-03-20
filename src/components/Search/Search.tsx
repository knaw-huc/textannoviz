import { Link } from "react-router-dom";
import { createIndices } from "../../utils/createIndices";

export const Search = () => {
  const indices = createIndices(51, 532);
  console.log(indices);
  return (
    <div style={{ display: "inline" }}>
      {indices.map((index, key) => (
        <>
          <Link key={key} to={`/detail/1728/${index}`}>
            Scan {index}
          </Link>
          <br />
        </>
      ))}
    </div>
  );
};
