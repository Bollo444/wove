import React, { useState, useEffect } from 'react';
import { useStory } from '../../contexts/StoryContext';
import ImageDisplay from '../media/ImageDisplay';
import VideoDisplay from '../media/VideoDisplay';
import AudioDisplay from '../media/AudioDisplay';
// Assuming StorySegment and MediaAsset types are compatible with those in StoryContext
// or ideally imported from a shared types definition.
// For simplicity, we'll assume compatibility for now.

interface DigitalBookViewerProps {
  bookId: string;
}

const SEGMENTS_PER_PAGE = 3; // Define how many segments constitute a "page"

const DigitalBookViewer: React.FC<DigitalBookViewerProps> = ({ bookId }) => {
  const { currentBookDetails, getBookDetails, isLoading: isContextLoading } = useStory();
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookId) {
      getBookDetails(bookId).catch(err => {
        console.error("Failed to get book details:", err);
        setError(err.message || 'Failed to load book details.');
      });
    }
  }, [bookId, getBookDetails]);

  // If bookUrl is present, render iframe
  if (currentBookDetails?.bookUrl) {
    return (
      <div className="w-full h-screen flex flex-col items-center p-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{currentBookDetails.title}</h2>
        {currentBookDetails.authorName && <p className="text-sm text-gray-600 mb-4">by {currentBookDetails.authorName}</p>}
        <iframe
          src={currentBookDetails.bookUrl}
          title={currentBookDetails.title}
          className="w-full h-full border-0 rounded-lg shadow-xl"
          allowFullScreen
        ></iframe>
      </div>
    );
  }
  
  // Native Rendering Logic
  const segments = currentBookDetails?.segments || [];
  const totalPages = Math.ceil(segments.length / SEGMENTS_PER_PAGE);
  const currentSegmentsOnPage = segments.slice(
    currentPage * SEGMENTS_PER_PAGE,
    (currentPage + 1) * SEGMENTS_PER_PAGE
  );

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (isContextLoading && !currentBookDetails) return <div className="text-center p-10">Loading book...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  if (!currentBookDetails) return <div className="text-center p-10">Book details not found.</div>;

  return (
    <div className="digital-book-viewer flex flex-col items-center p-4 bg-gray-50 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">{currentBookDetails.title}</h2>
      {currentBookDetails.coverArtUrl && !currentBookDetails.bookUrl && ( // Show cover if not iframe and URL exists
          <img src={currentBookDetails.coverArtUrl} alt={`Cover for ${currentBookDetails.title}`} className="w-48 h-auto my-4 rounded shadow-md"/>
      )}
      {/* Author name could be added if available in currentBookDetails */}
      {/* <p className="text-sm text-gray-600 mb-4">by {currentBookDetails.authorName}</p> */}


      {/* Page Display Area for Native Rendering */}
      <div className="book-page w-full max-w-3xl bg-white p-6 md:p-10 shadow-inner min-h-[70vh] overflow-y-auto border border-gray-300 rounded">
        {currentSegmentsOnPage.length > 0 ? currentSegmentsOnPage.map(segment => (
          <div key={segment.id} className="mb-6 pb-4 border-b border-gray-200 last:border-b-0">
            {segment.mediaAssets?.map(asset => (
              <div key={asset.id} className="my-3 clear-both"> {/* clear-both for floated images if any */}
                {asset.type === 'image' && (
                  <ImageDisplay
                    src={asset.url}
                    alt={asset.altText || `Image for segment ${segment.id}`}
                    className="max-w-md h-auto rounded mx-auto shadow-sm" // Adjusted styling
                  />
                )}
                {asset.type === 'video' && (
                   <VideoDisplay src={asset.url} className="max-w-md mx-auto shadow-sm" />
                )}
                {asset.type === 'audio' && (
                  <AudioDisplay src={asset.url} title={asset.altText || `Audio for segment ${segment.id}`} className="w-full" />
                )}
              </div>
            ))}
            <div
              className="prose prose-sm sm:prose-base lg:prose-lg max-w-none" // Tailwind Typography
              dangerouslySetInnerHTML={{ __html: segment.content }}
            />
          </div>
        )) : <p className="text-center text-gray-500">No content for this page.</p>}
      </div>

      {/* Navigation Controls */}
      <div className="navigation-controls flex justify-between items-center w-full max-w-3xl mt-6">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className="btn-secondary px-4 py-2 disabled:opacity-50"
          aria-label="Previous Page"
        >
          &larr; Previous
        </button>
        <span className="page-number text-gray-700">
          Page {currentPage + 1} of {totalPages > 0 ? totalPages : 1}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages - 1}
          className="btn-secondary px-4 py-2 disabled:opacity-50"
          aria-label="Next Page"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
};

export default DigitalBookViewer;
