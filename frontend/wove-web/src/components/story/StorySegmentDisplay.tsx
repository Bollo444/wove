import React from 'react';
import ImageDisplay from '../media/ImageDisplay';
import VideoDisplay from '../media/VideoDisplay';
import AudioDisplay from '../media/AudioDisplay';
// Using types from StoryContext or a shared location is preferred.
// For this example, assuming StoryContext exports these or they are globally available.
// If not, they would need to be imported from their definition file (e.g., ../../contexts/StoryContext)
// For now, let's assume they are implicitly available or defined locally for StorySegmentDisplay if StoryContext types are not directly imported.
// To make this concrete, let's assume a local definition for clarity if not directly importing from context.

interface MediaAsset { // Should match type in StoryContext
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  altText?: string;
}

interface StorySegment { // Should match type in StoryContext
  id: string;
  content: string;
  position: number;
  authorName?: string; 
  authorId?: string; // As per StoryContext definition
  mediaAssets?: MediaAsset[];
  createdAt?: string; // As per StoryContext definition
  // visualEffects, etc.
}

interface StorySegmentDisplayProps {
  segment: StorySegment; // Use the more accurate type
  isCurrentUserTurn?: boolean;
  onEdit?: (segmentId: string) => void;
  onAddChoice?: (segmentId: string) => void;
}

const StorySegmentDisplay: React.FC<StorySegmentDisplayProps> = ({
  segment,
  isCurrentUserTurn,
  onEdit,
  onAddChoice,
}) => {
  // Differentiate styling based on authorType (if available, e.g., from segment.authorType === 'AI')
  // const segmentStyle = segment.authorType === 'AI' 
  //   ? "bg-purple-50 border-l-4 border-purple-300" 
  //   : "bg-white";
  const authorType = (segment as any).authorType; // If authorType is part of segment from API
  const segmentStyle = authorType === 'ai' || authorType === 'AI'
    ? "bg-purple-50 border-l-4 border-purple-300 hover:shadow-purple-100"
    : "bg-white hover:shadow-slate-100";


  return (
    <div className={`mb-8 p-4 md:p-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out ${segmentStyle}`}>
      {/* Display Media Assets */}
      {segment.mediaAssets?.map(asset => (
        <div key={asset.id} className="mb-4 rounded-md overflow-hidden">
          {asset.type === 'image' && (
            <ImageDisplay
              src={asset.url}
              alt={asset.altText || `Image for segment ${segment.id}`}
            />
          )}
          {asset.type === 'video' && (
            <VideoDisplay
              src={asset.url}
              // VideoDisplay might not use 'alt', but could have a 'title' or similar
            />
          )}
          {asset.type === 'audio' && (
            <AudioDisplay
              src={asset.url}
              title={asset.altText || `Audio for segment ${segment.id}`} // Assuming AudioDisplay takes a title
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
