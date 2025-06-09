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
      <Layout title="Loading..." data-oid="lrzsb00">
        <div className="flex justify-center items-center min-h-[60vh]" data-oid="xucty7:">
          <div className="text-center" data-oid="gt3vvrj">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"
              data-oid="db9_e6g"
            ></div>
            <p className="text-gray-600" data-oid="k4r.s9_">
              Loading...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <Layout title="Create New Story - Wove" data-oid="g_eyo3p">
      <div className="container mx-auto py-8 px-4" data-oid="zuysx:y">
        <StoryCreateForm data-oid="x8p8c9f" />
      </div>
    </Layout>
  );
};

export default CreateStoryPage;
