import React from "react";

const CourseDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 sm:px-12 py-8">
        <div className="mb-8">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-6"></div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-96 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="h-6 w-full max-w-2xl bg-gray-200 rounded animate-pulse mb-6"></div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
        </div>

        <div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-2xl overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-64 aspect-video sm:aspect-square bg-gray-200 animate-pulse shrink-0"></div>
                  <div className="flex-1 p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse shrink-0"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-6 w-64 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-full max-w-md bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailSkeleton;
