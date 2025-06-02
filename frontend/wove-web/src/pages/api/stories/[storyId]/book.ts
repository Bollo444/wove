import type { NextApiRequest, NextApiResponse } from 'next';

type GenerateBookResponse = {
  bookId: string;
  status: string; // e.g., 'GENERATING', 'COMPLETED', 'FAILED'
  message?: string;
};

type ErrorResponse = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateBookResponse | ErrorResponse>
) {
  const { storyId } = req.query;

  if (req.method === 'POST') {
    // Simulate backend call to generate a book
    console.log(`API Route: Received POST request to generate book for storyId: ${storyId}`);

    // TODO: Replace with actual backend API call
    // For now, simulate different scenarios:
    if (storyId === 'error_story_id') {
      res.status(500).json({ message: 'Simulated error generating book.' });
    } else if (storyId === 'existing_book_story_id') {
      // Simulate if the book already exists and is completed
      res.status(200).json({ 
        bookId: storyId as string, // Assuming bookId might be same as storyId for simplicity here
        status: 'COMPLETED', 
        message: 'Book already exists and is available.' 
      });
    } else {
      // Simulate successful initiation of book generation
      res.status(202).json({ // 202 Accepted for async operation
        bookId: storyId as string, // Or generate a new unique bookId
        status: 'GENERATING',
        message: 'Book generation started. Check back later for status.',
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
