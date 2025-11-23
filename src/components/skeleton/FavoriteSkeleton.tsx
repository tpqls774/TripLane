import React from "react";

interface FavoriteSkeletonProps {
  count?: number;
}

const FavoriteSkeleton: React.FC<FavoriteSkeletonProps> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-200 cursor-pointer">
              <div className="w-full h-full bg-gray-200" />
            </div>

            <div className="p-4">
              <div className="text-lg font-bold text-gray-200 mb-1 line-clamp-2">
                <div className="h-6 bg-gray-200 rounded w-full" />
              </div>
              <div className="text-sm text-gray-200 line-clamp-1">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>

              <div className="flex gap-2 mt-4">
                <div className="flex-1 px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium" />
                <div className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium w-10" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FavoriteSkeleton;
