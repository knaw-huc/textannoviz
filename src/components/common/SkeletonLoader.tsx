import "./SkeletonLoader.css";

export function SkeletonLoader() {
  return (
    <div className="container" style={{ width: "20rem" }}>
      <div className="grid gap-2 pl-4 pt-4">
        <div className="skeleton-animation col-span-6 h-4 bg-gray-200"></div>
        <div className="skeleton-animation col-span-8 h-4 bg-gray-200"></div>
        <div className="skeleton-animation col-span-4 h-4 bg-gray-200"></div>
      </div>
    </div>
  );
}
