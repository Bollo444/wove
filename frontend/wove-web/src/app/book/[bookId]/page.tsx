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
      <Layout title="Error - Wove" data-oid="kc-w58v">
        <div className="text-center p-10" data-oid="tgbwah1">
          <p className="text-red-500" data-oid="8k98.rb">
            Book ID not found in URL.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Reading Book - Wove" data-oid="nyqooaf">
      {' '}
      {/* Title could be dynamic based on fetched book data */}
      <DigitalBookViewer bookId={bookId} data-oid="ugl5_1t" />
    </Layout>
  );
};

export default BookViewerPage;
