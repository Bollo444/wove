'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Layout from '../../../components/layout/Layout';
import DigitalBookViewer from '../../../components/book/DigitalBookViewer';

const BookViewerPage: React.FC = () => {
  const params = useParams();
  const bookId = params.bookId as string;

  if (!bookId) {
    return (
      <Layout title="Error - Wove">
        <div className="text-center p-10">
          <p className="text-red-500">Book ID not found in URL.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Reading Book - Wove">
      {' '}
      {/* Title could be dynamic based on fetched book data */}
      <DigitalBookViewer bookId={bookId} />
    </Layout>
  );
};

export default BookViewerPage;
