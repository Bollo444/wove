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
      <Layout title="Loading..." data-oid="li1qv18">
        <div className="flex justify-center items-center min-h-[60vh]" data-oid="t9xlut_">
          <div className="text-center" data-oid="xp.yijq">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"
              data-oid="-ehjv44"
            ></div>
            <p className="text-gray-600" data-oid="z249kom">
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
    <Layout title="Create New Story - Wove" data-oid="j3fc8yo">
      <div className="container mx-auto py-8 px-4" data-oid="1zgpj9r">
        <StoryCreateForm data-oid="hcc-1v4" />
      </div>
    </Layout>
  );
};

export default CreateStoryPage;
