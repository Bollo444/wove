'use client';

import React from 'react';
import Layout from '../../components/layout/Layout';
import StoryCreateForm from '../../components/story/StoryCreateForm';
// import { useAuth } from '../../contexts/AuthContext'; // Placeholder
// import { useRouter } from 'next/navigation'; // Placeholder

const CreateStoryPage: React.FC = () => {
  // const { user, isLoading } = useAuth(); // Placeholder
  // const router = useRouter();

  // useEffect(() => {
  //   if (!isLoading && !user) {
  //     router.push('/login?redirect=/create'); // Redirect to login if not authenticated
  //   }
  // }, [user, isLoading, router]);

  // if (isLoading || !user) {
  //   return <Layout title="Loading..."><p className="text-center">Loading...</p></Layout>;
  // }

  return (
    <Layout title="Create New Story - Wove">
      <StoryCreateForm />
    </Layout>
  );
};

export default CreateStoryPage;
