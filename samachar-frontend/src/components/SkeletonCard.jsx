export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
      <div className="flex justify-between mb-3">
        <div className="h-5 bg-gray-200 rounded-full w-32"></div>
        <div className="h-5 bg-gray-200 rounded-full w-10"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-4/5 mb-4"></div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="flex justify-between pt-2 border-t border-gray-100">
        <div className="h-3 bg-gray-200 rounded w-20"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  );
}