import type { NextApiRequest, NextApiResponse } from 'next';

// Define a basic structure for a book segment, similar to StorySegment
interface BookSegment {
  id: string;
  content: string; // Can be HTML string
  position: number;
  mediaAssets?: Array<{
    id: string;
    type: 'image' | 'video' | 'audio';
    url: string;
    altText?: string;
  }>;
}

// Define the structure for the book details response
// This will be used by DigitalBookViewer if bookUrl is null or native rendering is preferred
type BookDetailsResponse = {
  bookId: string;
  storyId: string; // Original story ID
  title: string;
  status: 'COMPLETED' | 'GENERATING' | 'PENDING' | 'FAILED'; // Status of the book generation
  bookUrl: string | null; // URL to an externally hosted interactive book (e.g., static HTML export)
  coverArtUrl?: string;
  segments: BookSegment[]; // Used for native rendering if bookUrl is null
  // Add other metadata like author, creationDate, etc.
};

type ErrorResponse = {
  message: string;
};

// Dummy segments data for simulation
const dummySegments: BookSegment[] = [
  {
    id: 'seg1',
    position: 1,
    content: '<h2>Chapter 1: The Beginning</h2><p>Once upon a time, in a land far, far away, there was a brave adventurer...</p>',
    mediaAssets: [{ id: 'img1', type: 'image', url: 'https://picsum.photos/seed/book_page1/600/400', altText: 'A scenic landscape' }],
  },
  {
    id: 'seg2',
    position: 2,
    content: '<p>The adventurer set out on a grand quest, facing many challenges along the way.</p>',
  },
  {
    id: 'seg3',
    position: 3,
    content: '<h3>The Dragon\'s Lair</h3><p>Finally, they reached the dragon\'s lair, shimmering with untold treasures and great danger.</p>',
    mediaAssets: [{ id: 'vid1', type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', altText: 'A placeholder video' }],
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BookDetailsResponse | ErrorResponse>
) {
  const { bookId } = req.query;

  if (req.method === 'GET') {
    console.log(`API Route: Received GET request for bookId: ${bookId}`);

    // TODO: Replace with actual backend API call to GET /stories/{bookId}/book or /books/{bookId}
    
    if (bookId === 'error_book_id') {
      res.status(500).json({ message: 'Simulated error fetching book details.' });
    } else if (bookId === 'iframe_book_id') {
      // Simulate a book that should be rendered via iframe
      res.status(200).json({
        bookId: bookId as string,
        storyId: `story_${bookId}`,
        title: 'The Grand Iframe Adventure',
        status: 'COMPLETED',
        bookUrl: 'https://www.storyplatform.com/sample-book-iframe-content/', // Example URL
        coverArtUrl: 'https://picsum.photos/seed/iframecover/300/400',
        segments: [], // Segments might be empty if bookUrl is primary
      });
    } else {
      // Simulate a book that should be rendered natively by DigitalBookViewer
      res.status(200).json({
        bookId: bookId as string,
        storyId: `story_${bookId}`, // Assuming storyId might be related or same
        title: `My Story Book: ${bookId}`,
        status: 'COMPLETED',
        bookUrl: null, // Indicate native rendering is preferred
        coverArtUrl: `https://picsum.photos/seed/${bookId}_cover/300/400`,
        segments: dummySegments, // Provide segment data for native rendering
      });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
