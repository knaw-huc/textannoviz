import { Link } from "react-router-dom";

export const GetHome = () => {
  return (
    <Link to="/search" className="ml-4 mt-8 text-xl">
      Go to search page
    </Link>
  );
};
