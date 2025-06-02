import React from 'react';
import StoryCard from './StoryCard';
import { Premise } from '../../types/story.d'; // Import Premise type

interface StoryGridProps {
  premises: Premise[]; // Changed to use Premise type
  isLoading?: boolean;
  error?: string | null;
}

const StoryGrid: React.FC<StoryGridProps> = ({ premises, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Placeholder Skeletons */}
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg animate-pulse">
            <div className="w-full h-48 bg-gray-300 rounded-t-lg"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-3"></div>
              <div className="h-10 bg-gray-300 rounded mb-3"></div>
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">Error loading story premises: {error}</p>;
  }

  if (!premises || premises.length === 0) {
    return <p className="text-gray-600 text-center">No story premises found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {premises.map(premise => (
        <StoryCard key={premise.premiseId} premise={premise} />
      ))}
    </div>
  );
};

export default StoryGrid;
