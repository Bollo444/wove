'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '../../../components/layout/Layout';
import StorySegmentDisplay from '../../../components/story/StorySegmentDisplay';
import CollaboratorsPanel from '../../../components/collaboration/CollaboratorsPanel';
import ChatInterface from '../../../components/collaboration/ChatInterface';
import { useStory } from '../../../contexts/StoryContext';
import { useAuth } from '../../../contexts/AuthContext';



const StoryPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const storyId = params.storyId as string;
  const { user } = useAuth();
  const { currentStory, isLoading, loadStory, addSegment } = useStory();

  const [error, setError] = useState<string | null>(null);
  const [currentUserInput, setCurrentUserInput] = useState('');
  const [isAddingSegment, setIsAddingSegment] = useState(false);

  useEffect(() => {
    if (storyId) {
      const loadCurrentStory = async () => {
        setError(null);
        try {
          await loadStory(storyId);
        } catch (err: any) {
          setError(err.message || 'Failed to load story.');
        }
      };

      loadCurrentStory();
    }
  }, [storyId, loadStory]);

  const handleAddSegment = async () => {
    if (!currentUserInput.trim() || !currentStory || !user) {
      return;
    }

    setIsAddingSegment(true);
    try {
      await addSegment(currentStory.id, currentUserInput.trim());
      setCurrentUserInput('');
    } catch (err: any) {
      setError(err.message || 'Failed to add segment.');
    } finally {
      setIsAddingSegment(false);
    }
  };

  const handleEditSegment = (segmentId: string) => {
    console.log(`Editing segment ${segmentId} (placeholder)`);
    alert(`Editing segment ${segmentId} - functionality not implemented.`);
  };

  const handleAddChoiceToSegment = (segmentId: string) => {
    console.log(`Adding choice to segment ${segmentId} (placeholder)`);
    alert(`Adding choice to segment ${segmentId} - functionality not implemented.`);
  };

  if (isLoading) {
    return (
      <Layout title="Loading Story...">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Story</h2>
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => router.push('/explore')}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Back to Explore
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentStory) {
    return (
      <Layout title="Story Not Found">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Story Not Found</h2>
            <p className="text-gray-600 mb-6">The story you're looking for doesn't exist or you don't have permission to view it.</p>
            <button
              onClick={() => router.push('/explore')}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              Back to Explore
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Determine if user can contribute to the story
  const canContribute = user && currentStory && (
    currentStory.collaborators?.some(collab => 
      collab.userId === user.id && ['owner', 'editor'].includes(collab.role)
    ) || !currentStory.isPrivate
  );

  return (
    <Layout title={currentStory.title}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Story Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push('/explore')}
              className="text-purple-600 hover:text-purple-700 flex items-center"
            >
              ← Back to Explore
            </button>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {currentStory.ageTier}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{currentStory.title}</h1>
          {currentStory.description && (
            <p className="text-gray-600 text-lg mb-4">{currentStory.description}</p>
          )}
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Status: {currentStory.status}</span>
            <span>•</span>
            <span>{currentStory.segments?.length || 0} segments</span>
            <span>•</span>
            <span>{currentStory.collaborators?.length || 0} collaborators</span>
          </div>
        </div>

        {/* Story Segments */}
        <div className="space-y-6 mb-8">
          {currentStory.segments && currentStory.segments.length > 0 ? (
            currentStory.segments
              .sort((a, b) => a.position - b.position)
              .map((segment) => (
                <StorySegmentDisplay
                  key={segment.id}
                  segment={segment}
                  isCurrentUserTurn={canContribute}
                  onEdit={handleEditSegment}
                  onAddChoice={handleAddChoiceToSegment}
                />
              ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No segments yet</h3>
              <p className="text-gray-500 mb-4">This story is waiting for its first chapter.</p>
              {canContribute && (
                <p className="text-purple-600">Be the first to contribute!</p>
              )}
            </div>
          )}
        </div>

        {/* Add Segment Form */}
        {canContribute && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Continue the Story</h3>
            <textarea
              value={currentUserInput}
              onChange={(e) => setCurrentUserInput(e.target.value)}
              placeholder="Write the next part of the story..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              disabled={isAddingSegment}
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">
                {currentUserInput.length} characters
              </span>
              <button
                onClick={handleAddSegment}
                disabled={!currentUserInput.trim() || isAddingSegment}
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAddingSegment ? 'Adding...' : 'Add Segment'}
              </button>
            </div>
          </div>
        )}

        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Join the Story</h3>
            <p className="text-blue-600 mb-4">Sign in to contribute to this collaborative story.</p>
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Collaboration Sidebar - Simplified for now */}
        {currentStory.collaborators && currentStory.collaborators.length > 0 && (
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Collaborators</h3>
            <div className="space-y-2">
              {currentStory.collaborators.map((collab) => (
                <div key={collab.userId} className="flex items-center justify-between">
                  <span className="text-gray-700">{collab.userId}</span>
                  <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {collab.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StoryPage;
