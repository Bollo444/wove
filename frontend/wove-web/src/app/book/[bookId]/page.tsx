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
      <Layout title="Error - Wove" data-oid="c:9mfo4">
        <div className="text-center p-10" data-oid="g4kz-8.">
          <p className="text-red-500" data-oid=":d.lp_6">
            Book ID not found in URL.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Reading Book - Wove" data-oid="hwyyf4e">
      {' '}
      {/* Title could be dynamic based on fetched book data */}
      <DigitalBookViewer bookId={bookId} data-oid="cgycbw:" />
    </Layout>
  );
};

export default BookViewerPage;
