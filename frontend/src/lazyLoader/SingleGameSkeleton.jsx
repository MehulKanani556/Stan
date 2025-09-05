import React from 'react';

const SingleGameSkeleton = () => {
  // Skeleton data for mapping - using map method for dynamic generation
  const generateSkeletonItems = (count, baseId = 0) => 
    Array.from({ length: count }, (_, i) => ({ id: baseId + i }));

  const skeletonData = {
    thumbnails: generateSkeletonItems(5),
    genres: generateSkeletonItems(4),
    features: generateSkeletonItems(4),
    systemRequirements: [
      { label: 'Memory', id: 1 },
      { label: 'Storage', id: 2 },
      { label: 'Graphics', id: 3 },
      { label: 'OS', id: 4 },
      { label: 'Processor', id: 5 }
    ],
    instructions: generateSkeletonItems(3),
    accordionItems: [
      { title: 'Platform', id: 1 },
      { title: 'Rating', id: 2 },
      { title: 'Purchase Info', id: 3 },
      { title: 'More Details', id: 4 }
    ],
    descriptionLines: generateSkeletonItems(3, 10),
    purchaseInfoItems: [
      { label: 'Game Size', id: 1 },
      { label: 'Epic Rewards', id: 2 }
    ],
    moreDetailsItems: [
      { label: 'Refund Type', id: 1 },
      { label: 'Developer', id: 2 },
      { label: 'Publisher', id: 3 },
      { label: 'Release Date', id: 4 },
      { label: 'Total Download', id: 5 }
    ]
  };

  // Helper function to render skeleton elements using map
  const renderSkeletonElements = (items, renderFunction) => 
    items.map(renderFunction);

  return (
    <div className=''>
      <div className="w-full max-w-[95%] md:max-w-[85%] mx-auto">
        {/* Title Skeleton */}
        <div>
          <div className='md:h-[48px] ms:h-[36px] h-[28px] w-3/4 bg-slate-700 rounded-lg animate-pulse mt-5'></div>
        </div>

        <div className="flex flex-col-reverse xl:flex-row lg:mt-11">
          {/* Left Content Skeleton */}
          <div className='3xl:w-3/4 2xl:w-2/3 xl:w-3/5 w-full xl:mt-0 mt-5'>
            <div>
              {/* Main Slider Skeleton */}
              <div className='ds_single_slider'>
                <div className="w-full xl:h-[660px] lg:h-[600px] ms:h-[500px] sm:h-[400px] h-[350px] bg-slate-700 rounded-lg animate-pulse relative overflow-hidden">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>

              {/* Thumbnail Slider Skeleton */}
              <div className='px-5'>
                <div className='mt-3 ds_mini_slider flex gap-3 overflow-x-auto'>
                  {skeletonData.thumbnails.map((item) => (
                    <div key={item.id} className="flex-shrink-0 relative w-full">
                      <div className="lg:h-[100px] sm:h-[90px] h-[70px] w-full bg-slate-700 rounded-lg animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features Section Skeleton */}
              <div className="py-10 md:px-4">
                <div className="">
                  {/* Description Skeleton */}
                  <div className="mb-12">
                    {renderSkeletonElements(skeletonData.descriptionLines, (line, index) => (
                      <div 
                        key={line.id} 
                        className={`h-4 bg-slate-700 rounded animate-pulse mb-2 ${
                          index === 1 ? 'w-5/6' : index === 2 ? 'w-4/6' : 'w-full'
                        }`}
                      ></div>
                    ))}
                  </div>

                  {/* Genres and Features Grid Skeleton */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Genres Skeleton */}
                    <div className="bg-black/30 p-6 rounded-lg shadow-lg">
                      <div className="h-6 w-20 bg-slate-600 rounded animate-pulse mb-4"></div>
                      <div className="flex flex-wrap gap-3">
                        {skeletonData.genres.map((genre) => (
                          <div key={genre.id} className="h-8 w-16 bg-slate-700 rounded-md animate-pulse"></div>
                        ))}
                      </div>
                    </div>

                    {/* Features Skeleton */}
                    <div className="bg-black/30 p-6 rounded-lg shadow-lg">
                      <div className="h-6 w-20 bg-slate-600 rounded animate-pulse mb-4"></div>
                      <div className="flex flex-wrap gap-3">
                        {skeletonData.features.map((feature) => (
                          <div key={feature.id} className="h-8 w-20 bg-slate-700 rounded-md animate-pulse"></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Game Details Skeleton */}
                  <div className="bg-black/30 p-8 rounded-lg shadow-lg mb-8">
                    <div className="h-6 w-48 bg-slate-600 rounded animate-pulse mb-1"></div>
                    <div className="h-4 w-32 bg-slate-600 rounded animate-pulse mb-4"></div>
                    <div className="space-y-2">
                      {renderSkeletonElements(skeletonData.descriptionLines, (line, index) => (
                        <div 
                          key={line.id} 
                          className={`h-4 bg-slate-600 rounded animate-pulse ${
                            index === 1 ? 'w-5/6' : index === 2 ? 'w-4/6' : 'w-full'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* System Requirements Skeleton */}
                  <div className="bg-black/20 p-8 rounded-lg shadow-lg w-full">
                    <div className="h-6 w-24 bg-slate-600 rounded animate-pulse pb-4 mb-6 border-b border-gray-700"></div>
                    <div className="h-5 w-32 bg-slate-600 rounded animate-pulse mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-5">
                        {skeletonData.systemRequirements.slice(0, 3).map((req) => (
                          <div key={req.id}>
                            <div className="h-3 w-16 bg-slate-500 rounded animate-pulse mb-1"></div>
                            <div className="h-3 w-32 bg-slate-600 rounded animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-5">
                        {skeletonData.systemRequirements.slice(3).map((req) => (
                          <div key={req.id}>
                            <div className="h-3 w-16 bg-slate-500 rounded animate-pulse mb-1"></div>
                            <div className="h-3 w-32 bg-slate-600 rounded animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Instructions Skeleton */}
                  <div className='mt-5 pt-2'>
                    <div className="bg-black/20 p-8 rounded-lg shadow-lg w-full">
                      <div className="h-6 w-28 bg-slate-600 rounded animate-pulse pb-4 mb-6 border-b border-gray-700"></div>
                      {skeletonData.instructions.map((instruction) => (
                        <div key={instruction.id} className='flex items-center mb-1'>
                          <div className="w-3 h-3 bg-slate-600 rounded-full animate-pulse me-2"></div>
                          <div className="h-4 w-64 bg-slate-600 rounded animate-pulse"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Content Skeleton */}
          <div className="3xl:w-1/4 2xl:w-1/3 xl:w-2/5 w-full xl:pl-6 mt-10 xl:mt-0">
            <div className="p-6 sticky top-24 bg-black/30">
              {/* Game Cover Image Skeleton */}
              <div className="flex justify-center mb-6">
                <div className="w-[330px] h-[200px] bg-slate-700 rounded-lg animate-pulse"></div>
              </div>
              
              {/* Price Skeleton */}
              <div className="h-6 w-16 bg-slate-600 rounded animate-pulse mb-6"></div>

              {/* Action Buttons Skeleton */}
              <div className="space-y-4 mb-6">
                <div className="flex gap-4">
                  <div className="w-full h-12 bg-slate-600 rounded-xl animate-pulse"></div>
                  <div className="w-full h-12 bg-slate-600 rounded-xl animate-pulse"></div>
                </div>
                <div className="w-full h-12 bg-slate-600 rounded-xl animate-pulse"></div>
              </div>

              {/* Accordion Skeleton */}
              <div className="divide-y divide-gray-700/60 rounded-xl overflow-hidden bg-black/30">
                {renderSkeletonElements(skeletonData.accordionItems, (item) => (
                  <div key={item.id} className="group">
                    <div className="flex items-center justify-between cursor-pointer py-4 px-4 md:px-5">
                      <div className="h-5 w-20 bg-slate-600 rounded animate-pulse"></div>
                      <div className="w-5 h-5 bg-slate-600 rounded animate-pulse"></div>
                    </div>
                    <div className="pb-5 px-4 md:px-5">
                      <div className="space-y-3">
                        {item.id === 3 ? (
                          // Purchase Info items
                          renderSkeletonElements(skeletonData.purchaseInfoItems, (infoItem) => (
                            <div key={infoItem.id} className="flex justify-between">
                              <div className="h-4 w-20 bg-slate-500 rounded animate-pulse"></div>
                              <div className="h-4 w-16 bg-slate-600 rounded animate-pulse"></div>
                            </div>
                          ))
                        ) : item.id === 4 ? (
                          // More Details items
                          renderSkeletonElements(skeletonData.moreDetailsItems, (detailItem) => (
                            <div key={detailItem.id} className="flex justify-between">
                              <div className="h-4 w-24 bg-slate-500 rounded animate-pulse"></div>
                              <div className="h-4 w-20 bg-slate-600 rounded animate-pulse"></div>
                            </div>
                          ))
                        ) : (
                          // Default accordion content
                          renderSkeletonElements(generateSkeletonItems(3), (contentItem) => (
                            <div key={contentItem.id} className="h-4 bg-slate-600 rounded animate-pulse" style={{width: `${20 + contentItem.id * 4}%`}}></div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default SingleGameSkeleton;
