'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '../../components/layout/Layout';
import StoryCreateForm from '../../components/story/StoryCreateForm';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

// A wrapper component to use useSearchParams because CreateStoryPage is not a Client Component by default
const CreateStoryPageContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const premiseId = searchParams.get('premiseId');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/create'); // Redirect to login if not authenticated
    }
  }, [user, isLoading, router]);

  if (isLoading || (!isLoading && !user)) { // Ensure user is checked after loading
    return <Layout title="Loading..."><p className="text-center p-8">Loading user data...</p></Layout>;
  }
  
  return (
    <Layout title="Create New Story - Wove">
      {/* Pass premiseId to StoryCreateForm. StoryCreateForm will fetch premise details if needed. */}
      <StoryCreateForm premiseId={premiseId} />
    </Layout>
  );
};

const CreateStoryPage: React.FC = () => {
  return (
    // Suspense is needed because useSearchParams() requires it.
    <Suspense fallback={<Layout title="Loading..."><p className="text-center p-8">Loading page...</p></Layout>}>
      <CreateStoryPageContent />
    </Suspense>
  );
};

export default CreateStoryPage;
