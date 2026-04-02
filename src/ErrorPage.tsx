import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <div>This page does not exist!</div>;
    }
  }
  console.error("Oops! Error:", error);
  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>
          {isRouteErrorResponse(error)
            ? error.statusText || error.error?.message
            : error instanceof Error
            ? error.message
            : typeof error === "string"
            ? error
            : "Unknown error message"}
        </i>
      </p>
    </div>
  );
};
