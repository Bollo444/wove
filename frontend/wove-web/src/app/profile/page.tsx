'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/layout/Layout';
import UserProfile from '../../components/user/UserProfile';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login'); // Redirect to login if not authenticated
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <Layout title="Loading Profile...">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title="Access Denied">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
            <button
              onClick={() => router.push('/login')}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Profile - Wove">
      <UserProfile userId={user.id} />
    </Layout>
  );
};

export default ProfilePage;
