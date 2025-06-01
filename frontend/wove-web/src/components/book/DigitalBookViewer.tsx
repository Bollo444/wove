import React, { useState, useEffect } from 'react';
// import { Story, StorySegment, MediaAsset } from '@shared/types/story'; // Assuming shared types

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
  mediaAssets?: MediaAssetPlaceholder[];
}
interface DigitalBookPlaceholder {
  id: string;
  title: string;
  authorName: string;
  coverImageUrl?: string;
  pages: Array<{
    // Each page could be a collection of segments or specially formatted content
    pageNumber: number;
    segments: StorySegmentPlaceholder[]; // Or just raw HTML content per page
    // Potentially page-specific background music or effects
  }>;
}

// Dummy Book Data
const dummyBookData: DigitalBookPlaceholder = {
  id: 'book1',
  title: 'The Grand Adventure of Sir Reginald',
  authorName: 'A. Storyteller',
  coverImageUrl: 'https://picsum.photos/seed/bookcover1/600/800',
  pages: [
    {
      pageNumber: 1,
      segments: [
        {
          id: 's1p1',
          position: 0,
          content:
            '<h2>Chapter 1: The Call</h2><p>Sir Reginald, a knight of considerable renown but modest means, found himself staring at a rather dusty map...</p>',
          mediaAssets: [
            {
              id: 'm1p1',
              type: 'image',
              url: 'https://picsum.photos/seed/reginaldmap/400/300',
              altText: 'Reginald with map',
            },
          ],
        },
      ],
    },
    {
      pageNumber: 2,
      segments: [
        {
          id: 's1p2',
          position: 0,
          content:
            "<p>The map spoke of a legendary treasure, hidden deep within the Dragon's Tooth Mountains. Many had sought it; none had returned.</p>",
        },
      ],
    },
    {
      pageNumber: 3,
      segments: [
        {
          id: 's2p3',
          position: 0,
          content:
            '<h3>A Perilous Journey Begins</h3><p>"Well," Reginald sighed, adjusting his slightly-too-large helmet, "adventure calls!"</p>',
          mediaAssets: [
            {
              id: 'm1p3',
              type: 'image',
              url: 'https://picsum.photos/seed/reginaldhelmet/400/300',
              altText: 'Reginald with helmet',
            },
          ],
        },
      ],
    },
    // ... more pages
  ],
};

interface DigitalBookViewerProps {
  bookId: string;
  // bookData?: DigitalBookPlaceholder; // Could be passed directly or fetched
}

const DigitalBookViewer: React.FC<DigitalBookViewerProps> = ({ bookId }) => {
  const [book, setBook] = useState<DigitalBookPlaceholder | null>(dummyBookData); // Use dummy data
  const [currentPage, setCurrentPage] = useState(0); // 0-indexed
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   // Fetch book data based on bookId if not passed as prop
  //   setIsLoading(true);
  //   // fetchBookData(bookId)
  //   //   .then(data => { setBook(data); setCurrentPage(0); })
  //   //   .catch(err => setError(err.message || 'Failed to load book.'))
  //   //   .finally(() => setIsLoading(false));
  //   setBook(dummyBookData); // Simulate fetch
  // }, [bookId]);

  const goToNextPage = () => {
    if (book && currentPage < book.pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const currentBookPage = book?.pages[currentPage];

  if (isLoading) return <div className="text-center p-10">Loading book...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  if (!book || !currentBookPage)
    return <div className="text-center p-10">Book not found or page missing.</div>;

  return (
    <div className="digital-book-viewer flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{book.title}</h2>
      <p className="text-sm text-gray-600 mb-4">by {book.authorName}</p>

      {/* Page Display Area - Placeholder for actual book-like layout */}
      <div className="book-page w-full max-w-2xl bg-white p-6 md:p-10 shadow-inner min-h-[60vh] overflow-y-auto border border-gray-300 rounded">
        {/* This would ideally use a more sophisticated page rendering, perhaps with columns or a flipbook library */}
        {currentBookPage.segments.map(segment => (
          <div key={segment.id} className="mb-4">
            {segment.mediaAssets?.map(asset => (
              <div key={asset.id} className="my-2">
                {asset.type === 'image' && (
                  <img
                    src={asset.url}
                    alt={asset.altText}
                    className="max-w-full h-auto rounded mx-auto"
                  />
                )}
                {/* Add video/audio display if needed in book format */}
              </div>
            ))}
            <div
              className="prose prose-sm sm:prose-base"
              dangerouslySetInnerHTML={{ __html: segment.content }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="navigation-controls flex justify-between items-center w-full max-w-2xl mt-6">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className="btn-secondary px-4 py-2 disabled:opacity-50"
          aria-label="Previous Page"
        >
          &larr; Previous
        </button>
        <span className="page-number text-gray-700">
          Page {currentPage + 1} of {book.pages.length}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage >= book.pages.length - 1}
          className="btn-secondary px-4 py-2 disabled:opacity-50"
          aria-label="Next Page"
        >
          Next &rarr;
        </button>
      </div>
      {/* Placeholder for Table of Contents, Bookmarks, etc. */}
    </div>
  );
};

export default DigitalBookViewer;
