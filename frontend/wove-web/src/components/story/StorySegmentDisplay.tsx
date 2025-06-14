import React from 'react';
import ImageDisplay from '../media/ImageDisplay';
import VideoDisplay from '../media/VideoDisplay';
import AudioDisplay from '../media/AudioDisplay';
// import { StorySegment, MediaAsset } from '@shared/types/story'; // Assuming shared types

// Placeholder types if not using shared yet
interface MediaAssetPlaceholder {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  altText?: string;
}

interface StorySegmentPlaceholder {
  id: string;
  content: string;
  position: number;
  authorName?: string; // Or authorId to link to profile
  mediaAssets?: MediaAssetPlaceholder[];
  // Add other relevant fields like mood, visualEffects settings, etc.
}

interface StorySegmentDisplayProps {
  segment: StorySegmentPlaceholder;
  isCurrentUserTurn?: boolean; // For collaborative stories
  onEdit?: (segmentId: string) => void; // If editable
  onAddChoice?: (segmentId: string) => void; // If branching is possible from here
}

const StorySegmentDisplay: React.FC<StorySegmentDisplayProps> = ({
  segment,
  isCurrentUserTurn,
  onEdit,
  onAddChoice,
}) => {
  return (
    <div className="mb-8 p-4 md:p-6 bg-white rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl">
      {/* Display Media Assets (e.g., image at the top of the segment) */}
      {segment.mediaAssets?.map(asset => (
        <div key={asset.id} className="mb-4">
          {asset.type === 'image' && (
            <ImageDisplay
              src={asset.url}
              alt={asset.altText || `Image for segment ${segment.id}`}
            />
          )}
          {asset.type === 'video' && (
            <VideoDisplay
              src={asset.url}
              alt={asset.altText || `Video for segment ${segment.id}`}
            />
          )}
          {asset.type === 'audio' && (
            <AudioDisplay
              src={asset.url}
              title={asset.altText || `Audio for segment ${segment.id}`}
            />
          )}
        </div>
      ))}

      {/* Segment Content */}
      {/* Using 'prose' class from Tailwind Typography for better text rendering if installed */}
      <div
        className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: segment.content }} // Assuming content might be HTML from a rich text editor
      />

      {segment.authorName && (
        <p className="text-xs text-gray-500 mt-3 text-right italic">- {segment.authorName}</p>
      )}

      {/* Placeholder for interactive elements / choices / editing tools */}
      {(onEdit || onAddChoice) && isCurrentUserTurn && (
        <div className="mt-4 pt-3 border-t border-gray-200 flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(segment.id)}
              className="btn-secondary text-xs"
              aria-label={`Edit segment ${segment.position + 1}`}
            >
              Edit Segment
            </button>
          )}
          {onAddChoice && (
            <button
              onClick={() => onAddChoice(segment.id)}
              className="btn-secondary text-xs"
              aria-label={`Add choice after segment ${segment.position + 1}`}
            >
              Add Choice/Next Segment
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default StorySegmentDisplay;
