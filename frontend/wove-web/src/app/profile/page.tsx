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
      <Layout title="Loading Profile..." data-oid="xwbo5zx">
        <div className="flex justify-center items-center min-h-screen" data-oid="bwjsqpt">
          <div
            className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"
            data-oid="temrsr0"
          ></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title="Access Denied" data-oid="btmk5fl">
        <div className="max-w-4xl mx-auto px-4 py-8" data-oid="8q4n9nn">
          <div className="text-center" data-oid="1k0b88w">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4" data-oid="ap9s_k5">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6" data-oid="b60o8rl">
              You need to be logged in to view your profile.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors"
              data-oid="2xahrqu"
            >
              Sign In
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Profile - Wove" data-oid="ph36dmk">
      <UserProfile userId={user.id} data-oid="ll6_ca7" />
    </Layout>
  );
};

export default ProfilePage;
