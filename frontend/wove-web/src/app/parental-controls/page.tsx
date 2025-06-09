'use client';

import React from 'react';
import Layout from '../../components/layout/Layout';
import ParentalControlDashboard from '../../components/user/ParentalControlDashboard';
// import { useAuth } from '../../contexts/AuthContext'; // Placeholder
// import { useRouter } from 'next/navigation'; // Placeholder

const ParentalControlsPage: React.FC = () => {
  // const { user, isLoading } = useAuth(); // Placeholder
  // const router = useRouter();

  // useEffect(() => {
  //   if (!isLoading && !user) {
  //     router.push('/login'); // Redirect to login if not authenticated
  //   }
  //   // Add additional check if user is a parent or has parental role
  //   // if (!isLoading && user && !user.isParent) {
  //   //   router.push('/dashboard'); // Or some other appropriate page
  //   // }
  // }, [user, isLoading, router]);

  // if (isLoading || !user /* || !user.isParent */) {
  //   return <Layout title="Loading Parental Controls..."><p className="text-center">Loading...</p></Layout>;
  // }

  return (
    <Layout title="Parental Controls - Wove" data-oid="nkwpd44">
      <ParentalControlDashboard data-oid="osrb68." />
    </Layout>
  );
};

export default ParentalControlsPage;
