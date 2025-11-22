import React from "react";

const PlaceDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 sm:px-12 py-8 max-w-6xl">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>

        <div className="aspect-video bg-gray-200 rounded-2xl animate-pulse mb-8"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div className="pb-8 border-b border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 space-y-3">
                  <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-10 w-96 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse ml-4"></div>
              </div>
            </div>

            <div className="pb-10 border-b border-gray-200">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="pb-10 border-b border-gray-200">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-200 rounded-2xl animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            <div>
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-6"></div>
              <div className="w-full h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-4"></div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="border border-gray-200 rounded-2xl p-6 space-y-6">
                <div className="h-7 w-32 bg-gray-200 rounded animate-pulse pb-4 border-b border-gray-200"></div>

                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailSkeleton;
