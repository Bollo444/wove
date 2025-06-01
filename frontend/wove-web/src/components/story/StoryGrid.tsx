import React from 'react';
import StoryCard from './StoryCard';
// import { Story } from '@shared/types/story'; // Assuming a shared Story type

// Placeholder for Story type if not using shared type yet
interface StoryPlaceholder {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  authorName: string;
  authorId: string;
  ageTier: string;
  tags?: string[];
  viewCount?: number;
  likeCount?: number;
}

interface StoryGridProps {
  stories: StoryPlaceholder[]; // Replace with actual Story type later
  isLoading?: boolean;
  error?: string | null;
}

const StoryGrid: React.FC<StoryGridProps> = ({ stories, isLoading, error }) => {
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
    return <p className="text-red-500 text-center">Error loading stories: {error}</p>;
  }

  if (!stories || stories.length === 0) {
    return <p className="text-gray-600 text-center">No stories found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {stories.map(story => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  );
};

export default StoryGrid;
