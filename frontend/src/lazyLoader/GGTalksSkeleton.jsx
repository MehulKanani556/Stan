import React from 'react';

const GGTalksSkeleton = () => {
  return (
    <div className="flex bg-gray-950 relative overflow-hidden h-[calc(100vh-64px-56px)] md:h-[calc(100vh-72px)]">
      {/* User List Sidebar Skeleton */}
      <aside className="relative md:relative top-0 left-0 h-full h-[calc(100vh-64px)] md:h-[calc(100vh-72px)] w-full md:w-64 bg-gray-900 border-r border-gray-800 z-40 flex flex-col overflow-hidden">
        {/* Header Skeleton */}
        <div className="flex items-center border-b border-gray-700 justify-between p-4 py-[18px] border-b-gray-600 bg-gray-900">
          <div className="w-24 h-6 bg-gray-700 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-700 rounded-md animate-pulse"></div>
        </div>

        {/* User List Skeleton */}
        <div className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-gray-800">
            {[...Array(6)].map((_, index) => (
              <li key={index} className="p-4">
                <div className="flex items-center gap-3">
                  {/* Profile photo skeleton */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-12 h-12 bg-gray-700 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-gray-600 rounded-full absolute -right-0.5 -bottom-0.5 animate-pulse"></div>
                  </div>

                  {/* User info skeleton */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="w-20 h-4 bg-gray-700 rounded animate-pulse"></div>
                      <div className="w-16 h-3 bg-gray-700 rounded animate-pulse"></div>
                    </div>
                    <div className="w-32 h-3 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Chat Area Skeleton */}
      <div className="min-w-0 flex-1 flex flex-col">
        {/* Chat Header Skeleton */}
        <div className="flex items-center gap-3 px-4 py-[6px] bg-gray-800 text-white shadow-md border-b border-gray-700 h-16">
          <div className="flex items-center gap-3 flex-1">
            {/* User avatar skeleton */}
            <div className="flex-shrink-0 relative">
              <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-gray-600 rounded-full absolute -right-0.5 -bottom-0.5 animate-pulse"></div>
            </div>

            {/* User info skeleton */}
            <div className="flex-1 min-w-0">
              <div className="w-24 h-5 bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="w-20 h-3 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Messages Area Skeleton */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex flex-col h-full bg-gray-950 text-gray-100">
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 bg-gray-950">
              {/* Date separator skeleton */}
              <div className="flex items-center justify-center my-4">
                <div className="w-24 h-6 bg-gray-800 rounded-full animate-pulse"></div>
              </div>

              {/* Message skeletons */}
              {[...Array(4)].map((_, index) => (
                <div key={index} className={`flex items-end gap-2 ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
                  {/* Avatar skeleton for received messages */}
                  {index % 2 === 0 && (
                    <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse flex-shrink-0"></div>
                  )}

                  {/* Message bubble skeleton */}
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm relative ${
                    index % 2 === 0 
                      ? "bg-gray-800 border border-gray-700 rounded-bl-md" 
                      : "bg-gray-700 rounded-br-md ml-auto"
                  }`}>
                    <div className="w-48 h-4 bg-gray-600 rounded animate-pulse mb-2"></div>
                    <div className="w-16 h-3 bg-gray-600 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}

              {/* More message skeletons */}
              {[...Array(3)].map((_, index) => (
                <div key={`more-${index}`} className={`flex items-end gap-2 ${index % 2 === 1 ? "justify-start" : "justify-end"}`}>
                  {/* Avatar skeleton for received messages */}
                  {index % 2 === 1 && (
                    <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse flex-shrink-0"></div>
                  )}

                  {/* Message bubble skeleton */}
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm relative ${
                    index % 2 === 1 
                      ? "bg-gray-800 border border-gray-700 rounded-bl-md" 
                      : "bg-gray-700 rounded-br-md ml-auto"
                  }`}>
                    <div className="w-32 h-4 bg-gray-600 rounded animate-pulse mb-2"></div>
                    <div className="w-20 h-3 bg-gray-600 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Input Skeleton */}
        <div className="p-3 sm:p-4 bg-gray-800 shadow-lg">
          <div className="flex items-end gap-2 sm:gap-3 max-w-[95%] mx-auto">
            {/* Text input skeleton */}
            <div className="flex-1 relative">
              <div className="w-full h-12 bg-gray-700 rounded-2xl animate-pulse"></div>
            </div>

            {/* Send button skeleton */}
            <div className="flex-shrink-0 p-3 rounded-full shadow-md text-xl">
              <div className="w-6 h-6 bg-gray-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GGTalksSkeleton;
