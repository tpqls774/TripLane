import React from "react";

interface FavoriteSkeletonProps {
  count?: number;
}

const FavoriteSkeleton: React.FC<FavoriteSkeletonProps> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
          <div className="aspect-video bg-gray-200" />
          <div className="p-4">
            <div className="h-6 bg-gray-200 rounded-lg mb-2 w-3/4" />
            <div className="h-4 bg-gray-200 rounded-lg mb-4 w-1/2" />
            <div className="flex gap-2">
              <div className="flex-1 h-9 bg-gray-200 rounded-lg" />
              <div className="w-9 h-9 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FavoriteSkeleton;
