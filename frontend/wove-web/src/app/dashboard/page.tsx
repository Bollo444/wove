'use client';

import React, { useEffect, useState } from 'react'; // Added useState
import { useRouter } from 'next/navigation';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { useStory, Story } from '../../contexts/StoryContext'; // Added useStory and Story
import StoryGrid from '../../components/story/StoryGrid'; // Added StoryGrid
import NotificationBell from '../../components/notifications/NotificationBell'; // Added NotificationBell

const DashboardPage: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth(); // Renamed isLoading to authLoading for clarity
  const router = useRouter();
  const { stories, isLoading: storyLoading, loadUserStories } = useStory();

  const [inProgressStories, setInProgressStories] = useState<Story[]>([]);
  const [completedStories, setCompletedStories] = useState<Story[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?message=Please login to view your dashboard.');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    // Load user stories when the user is available and loadUserStories function is present
    if (user && loadUserStories) {
      loadUserStories();
    }
  }, [user, loadUserStories]);

  useEffect(() => {
    // Filter stories when the stories array changes
    if (stories) {
      setInProgressStories(stories.filter(story => story.status === 'active' || story.status === 'draft'));
      setCompletedStories(stories.filter(story => story.status === 'completed'));
    }
  }, [stories]);

  if (authLoading || !user) { // Still use authLoading for the main page block
    return (
      <Layout title="Dashboard - Wove">
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard - Wove" showSidebar={true}> {/* Assuming sidebar might be useful here */}
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome back, {user.username || user.email}!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Section: Start a New Story */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Start Your Adventure</h2>
            <button
              onClick={() => router.push('/explore')} // Or '/create'
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Discover Story Premises
            </button>
             <button
              onClick={() => router.push('/create')}
              className="ml-4 border-2 border-purple-600 text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
            >
              Create a New Story
            </button>
          </div>

          {/* Section: Continue Story (Placeholder) */}
          <div className="lg:col-span-2 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Continue Your Stories</h2>
            {storyLoading && !inProgressStories.length ? (
              <p className="text-gray-500">Loading your active stories...</p>
            ) : !storyLoading && inProgressStories.length === 0 ? (
              <p className="text-gray-600">You have no active stories. Why not start a new one?</p>
            ) : (
              <StoryGrid stories={inProgressStories} isLoading={storyLoading} />
            )}
          </div>

          {/* Section: My Library (Placeholder) */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">My Library</h2>
            {storyLoading && !completedStories.length ? (
              <p className="text-gray-500">Loading your library...</p>
            ) : !storyLoading && completedStories.length === 0 ? (
              <p className="text-gray-600">Your library is empty. Complete a story to see it here!</p>
            ) : (
              <StoryGrid stories={completedStories} isLoading={storyLoading} />
            )}
          </div>

          {/* Section: Collaboration Hub (Placeholder) */}
          <div className="md:col-span-1 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Collaboration Hub</h2>
            <p className="text-gray-600">Pending invitations and active collaborations.</p>
            {/* Example: <CollaborationSummary /> */}
          </div>

          {/* Section: Notifications */}
          <div className="md:col-span-1 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Notifications</h2>
            <div className="flex items-center space-x-2">
                <NotificationBell />
                <p className="text-gray-600 text-sm">Click the bell for updates.</p>
            </div>
            <button
                onClick={() => router.push('/notifications')} // Assuming a /notifications page might exist
                className="mt-2 text-sm text-purple-600 hover:underline">
                View all notifications
            </button>
          </div>

           {/* Section: Discover More (Placeholder) */}
          <div className="md:col-span-1 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Discover More</h2>
            <p className="text-gray-600">Explore featured stories or new premises.</p>
            <button
              onClick={() => router.push('/explore')}
              className="mt-2 text-sm text-purple-600 hover:underline"
            >
              Go to Story Library
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
