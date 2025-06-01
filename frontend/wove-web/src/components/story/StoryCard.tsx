import React from 'react';
import Link from 'next/link';
// import { Story } from '@shared/types/story'; // Assuming a shared Story type
// import { AgeTier } from '@shared/types/age-tier';

// Placeholder for Story type if not using shared type yet
interface StoryPlaceholder {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  authorName: string;
  authorId: string;
  ageTier: string; // e.g., AgeTier.KIDS
  tags?: string[];
  viewCount?: number;
  likeCount?: number;
}

interface StoryCardProps {
  story: StoryPlaceholder; // Replace with actual Story type later
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  const MAX_DESCRIPTION_LENGTH = 100;
  const truncatedDescription = story.description
    ? story.description.length > MAX_DESCRIPTION_LENGTH
      ? `${story.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
      : story.description
    : 'No description available.';

  // Placeholder for age tier specific styling/icon
  const getAgeTierBadge = (ageTier: string) => {
    switch (ageTier.toUpperCase()) {
      case 'KIDS':
        return (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Kids</span>
        );
      case 'TEENS_U16':
      case 'TEENS_16_PLUS':
        return (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Teens</span>
        );
      case 'ADULTS':
        return (
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
            Adults
          </span>
        );
      default:
        return (
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
            All Ages
          </span>
        );
    }
  };

  return (
    <Link href={`/story/${story.id}`} legacyBehavior>
      <a className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
        <div className="relative w-full h-48">
          {/* Placeholder Image */}
          <img
            src={story.coverImageUrl || `https://picsum.photos/seed/${story.id}/400/300`}
            alt={`Cover image for ${story.title}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2">{getAgeTierBadge(story.ageTier)}</div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate group-hover:text-purple-600 transition-colors">
            {story.title}
          </h3>
          <p className="text-xs text-gray-500 mb-2">
            By{' '}
            <Link href={`/profile/${story.authorId}`} legacyBehavior>
              <a onClick={e => e.stopPropagation()} className="hover:underline text-purple-500">
                {story.authorName}
              </a>
            </Link>
          </p>
          <p className="text-sm text-gray-600 mb-3 h-10 overflow-hidden">{truncatedDescription}</p>
          {story.tags && story.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
              {story.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{story.viewCount || 0} views</span>
            <span>{story.likeCount || 0} likes</span>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default StoryCard;
