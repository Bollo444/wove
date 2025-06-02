import React from 'react';
import Link from 'next/link';
import { Premise } from '../../types/story.d'; // Import Premise type
// import { AgeTier } from '@shared/types/age-tier'; // Could be used for strict typing of ageTier

interface StoryCardProps {
  premise: Premise; // Changed to use Premise type
}

const StoryCard: React.FC<StoryCardProps> = ({ premise }) => {
  const MAX_DESCRIPTION_LENGTH = 100;
  const truncatedDescription = premise.description
    ? premise.description.length > MAX_DESCRIPTION_LENGTH
      ? `${premise.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
      : premise.description
    : 'No description available.';

  // Age tier specific styling/icon
  const getAgeTierBadge = (ageTier: string) => {
    // Ensure ageTier is a string and handle potential undefined cases gracefully
    const normalizedAgeTier = (ageTier || 'unverified').toUpperCase();
    switch (normalizedAgeTier) {
      case 'KIDS':
        return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Kids</span>;
      case 'TEENS': // API doc uses 'teens', shared/types/age-tier.ts uses 'teens'
        return <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Teens</span>;
      case 'ADULTS':
        return <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Adults</span>;
      default: // Covers 'UNVERIFIED' or any other case
        return <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">All Ages</span>;
    }
  };
  
  // Link to start creating a story from this premise. Passes premiseId to the create page.
  const createStoryLink = `/create?premiseId=${premise.premiseId}`;

  return (
    <div className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <div className="relative w-full h-48">
        <img
          src={premise.coverArtUrl || `https://picsum.photos/seed/${premise.premiseId}/400/300`}
          alt={`Cover image for ${premise.title}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2">{getAgeTierBadge(premise.ageTier)}</div>
      </div>
      <div className="p-4 flex flex-col flex-grow"> {/* Added flex-grow and flex-col */}
        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate group-hover:text-purple-600 transition-colors">
          {premise.title}
        </h3>
        {/* Author and view/like counts are not part of Premise type based on API doc */}
        <p className="text-sm text-gray-600 mb-3 h-20 overflow-y-auto flex-grow">{truncatedDescription}</p> {/* Added flex-grow */}
        
        {(premise.genre && premise.genre.length > 0) && (
          <div className="mb-2 flex flex-wrap gap-1">
            {premise.genre.map(g => (
              <span key={g} className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">{g}</span>
            ))}
          </div>
        )}
        {(premise.theme && premise.theme.length > 0) && (
          <div className="mb-3 flex flex-wrap gap-1">
            {premise.theme.map(t => (
              <span key={t} className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
        )}
        {/* Link to start creating a story from this premise */}
        <div className="mt-auto pt-2"> {/* Added mt-auto to push button to bottom */}
          <Link href={createStoryLink} legacyBehavior>
            <a className="btn-primary text-sm w-full text-center justify-center py-2">
              Start Story from this Premise
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
