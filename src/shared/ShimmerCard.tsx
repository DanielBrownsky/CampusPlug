
const ShimmerCard = () => {
  return (
    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl shadow p-4 flex flex-col gap-3">
      <div className="h-40 bg-gray-300 dark:bg-gray-600 rounded-md" />
      <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded" />
      <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded" />
    </div>
  );
};

export default ShimmerCard;
