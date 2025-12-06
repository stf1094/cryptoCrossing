import React from 'react';

function LoadingState() {
  // Create an array to represent loading placeholder items
  const skeletonItems = Array(5).fill(null);
  
  return (
    <div className="w-full">
      {/* Skeleton for the total amount */}
      <div className="mb-8 flex flex-row justify-end">
        <div className="h-12 w-48 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* Skeleton table for portfolio items */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        {/* Table header skeleton */}
        <div className="grid grid-cols-5 gap-4 bg-gray-50 p-4 border-b">
          {Array(5).fill(null).map((_, index) => (
            <div 
              key={`header-${index}`}
              className="h-6 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>

        {/* Table body skeleton */}
        {skeletonItems.map((_, index) => (
          <div 
            key={`row-${index}`}
            className="grid grid-cols-5 gap-4 p-4 border-b last:border-b-0"
          >
            {/* Coin name and icon */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
            
            {/* Price skeleton */}
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
            
            {/* Holdings skeleton */}
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
            
            {/* Value skeleton */}
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            
            {/* Actions skeleton */}
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default LoadingState;