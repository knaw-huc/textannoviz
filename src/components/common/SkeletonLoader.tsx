export function SkeletonLoader() {
  return (
    <div className="container" style={{ width: "20rem" }}>
      <div className="grid animate-pulse gap-2 pl-4 pt-4">
        <div className="col-span-6 h-4 rounded-xl bg-gray-200"></div>
        <div className="col-span-8 h-4 rounded-xl bg-gray-200"></div>
        <div className="col-span-4 h-4 rounded-xl bg-gray-200"></div>
      </div>
    </div>
  );
}
