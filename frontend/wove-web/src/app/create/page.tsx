'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/layout/Layout';
import StoryCreateForm from '../../components/story/StoryCreateForm';
import { useAuth } from '../../contexts/AuthContext';

const CreateStoryPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/create'); // Redirect to login if not authenticated
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <Layout title="Loading...">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <Layout title="Create New Story - Wove">
      <div className="container mx-auto py-8 px-4">
        <StoryCreateForm />
      </div>
    </Layout>
  );
};

export default CreateStoryPage;
