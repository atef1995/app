import Card from "../Card";

const CardSkeleton = () => {
  return (
    <Card
      footer={
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      }
    >
      <div className="flex items-start justify-between mb-4 animate-pulse">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          <div className="h-4 mt-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
        <div className="ml-4">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        </div>
      </div>
    </Card>
  );
};

export default CardSkeleton;
