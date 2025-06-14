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
      <Layout title="Error - Wove" data-oid="igrmg.k">
        <div className="text-center p-10" data-oid="r2:v4q6">
          <p className="text-red-500" data-oid="a-8y:fr">
            Book ID not found in URL.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Reading Book - Wove" data-oid="8weu1_u">
      {' '}
      {/* Title could be dynamic based on fetched book data */}
      <DigitalBookViewer bookId={bookId} data-oid="ndyc49u" />
    </Layout>
  );
};

export default BookViewerPage;
