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
      <Layout title="Loading Profile..." data-oid="t9_k--v">
        <div className="flex justify-center items-center min-h-screen" data-oid=":6au-mm">
          <div
            className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"
            data-oid=":p9l4zr"
          ></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout title="Access Denied" data-oid="usr_fzm">
        <div className="max-w-4xl mx-auto px-4 py-8" data-oid="_6tpj:3">
          <div className="text-center" data-oid="0a4ftpc">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4" data-oid="zrl91vc">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6" data-oid="h5zxsz0">
              You need to be logged in to view your profile.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors"
              data-oid="_ftoctu"
            >
              Sign In
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My Profile - Wove" data-oid="93-dh9l">
      <UserProfile userId={user.id} data-oid="n1z1ran" />
    </Layout>
  );
};

export default ProfilePage;
