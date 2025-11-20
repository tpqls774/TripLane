import React from "react";

interface CourseSkeletonProps {
  count?: number;
}

const CourseSkeleton: React.FC<CourseSkeletonProps> = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Image Skeleton */}
          <div className="h-48 bg-gray-200" />

          {/* Content Skeleton */}
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded-lg mb-3 w-3/4" />
            <div className="h-4 bg-gray-200 rounded-lg mb-4 w-1/2" />

            {/* Stats Skeleton */}
            <div className="flex items-center gap-4 mb-4">
              <div className="h-4 bg-gray-200 rounded-lg w-20" />
              <div className="h-4 bg-gray-200 rounded-lg w-24" />
            </div>

            {/* Button Skeleton */}
            <div className="h-10 bg-gray-200 rounded-xl w-full" />
          </div>
        </div>
      ))}
    </>
  );
};

export default CourseSkeleton;
