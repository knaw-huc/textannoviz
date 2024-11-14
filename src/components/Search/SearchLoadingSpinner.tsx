export const SearchLoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
      <div
        className="spinner-border inline-block h-12 w-12 animate-spin rounded-full border-4"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};
