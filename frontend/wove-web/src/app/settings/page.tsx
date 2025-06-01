'use client';

import React from 'react';
import Layout from '../../components/layout/Layout';
import UserSettingsForm from '../../components/user/UserSettingsForm';
// import { useAuth } from '../../contexts/AuthContext'; // Placeholder
// import { useRouter } from 'next/navigation'; // Placeholder

const SettingsPage: React.FC = () => {
  // const { user, isLoading } = useAuth(); // Placeholder
  // const router = useRouter();

  // useEffect(() => {
  //   if (!isLoading && !user) {
  //     router.push('/login'); // Redirect to login if not authenticated
  //   }
  // }, [user, isLoading, router]);

  // if (isLoading || !user) {
  //   return <Layout title="Loading Settings..."><p className="text-center">Loading...</p></Layout>;
  // } // Removed extra closing brace that was here

  return (
    <Layout title="Account Settings - Wove">
      <UserSettingsForm />
    </Layout>
  );
};

export default SettingsPage;
