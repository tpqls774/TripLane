import React from "react";

interface PlaceSkeletonProps {
  count?: number;
}

const PlaceSkeleton: React.FC<PlaceSkeletonProps> = ({ count = 20 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-gray-200" />

          <div className="pl-1">
            <div className="h-5 bg-gray-200 rounded-lg mb-1 w-3/4" />
            <div className="h-4 bg-gray-200 rounded-lg w-1/2" />
          </div>
        </div>
      ))}
    </>
  );
};

export default PlaceSkeleton;
