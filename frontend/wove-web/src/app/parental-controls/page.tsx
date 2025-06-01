'use client';

import React from 'react';
import Layout from '../../components/layout/Layout';
import ParentalControlDashboard from '../../components/user/ParentalControlDashboard';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'; // React should already be imported, but useEffect is needed.

const ParentalControlsPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login'); // Redirect to login if not authenticated
    } else if (!isLoading && user && (user as any).role !== 'parent') { // Assuming user.role will exist
      router.push('/explore'); // Redirect if not a parent
    }
  }, [user, isLoading, router]);

  // Show loading state while auth is being determined or if access is denied before redirect
  if (isLoading || !user || (user && (user as any).role !== 'parent')) {
    return <Layout title="Loading Parental Controls..."><p className="text-center">Loading...</p></Layout>;
  }

  return (
    <Layout title="Parental Controls - Wove">
      <ParentalControlDashboard />
    </Layout>
  );
};

export default ParentalControlsPage;
