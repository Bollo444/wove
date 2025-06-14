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
      <Layout title="Loading Story..." data-oid="g4l.syl">
        <div className="flex justify-center items-center min-h-screen" data-oid="486ouei">
          <div
            className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"
            data-oid="n2lrrpa"
          ></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error" data-oid="tma3eq7">
        <div className="max-w-4xl mx-auto px-4 py-8" data-oid="_s_ujoy">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6" data-oid="rz.v:0a">
            <h2 className="text-xl font-semibold text-red-800 mb-2" data-oid="6ypmd2b">
              Error Loading Story
            </h2>
            <p className="text-red-600" data-oid="nkpenwu">
              {error}
            </p>
            <button
              onClick={() => router.push('/explore')}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              data-oid="d4k9oc."
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
      <Layout title="Story Not Found" data-oid="i-hnsa8">
        <div className="max-w-4xl mx-auto px-4 py-8" data-oid="lbk:dcp">
          <div className="text-center" data-oid="0mua_qe">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4" data-oid="g5r7l17">
              Story Not Found
            </h2>
            <p className="text-gray-600 mb-6" data-oid="pdv_ybn">
              The story you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <button
              onClick={() => router.push('/explore')}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors"
              data-oid="m2_:wg6"
            >
              Back to Explore
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Determine if user can contribute to the story
  const canContribute =
    user &&
    currentStory &&
    (currentStory.collaborators?.some(
      collab => collab.userId === user.id && ['owner', 'editor'].includes(collab.role),
    ) ||
      !currentStory.isPrivate);

  return (
    <Layout title={currentStory.title} data-oid="g.pwlyo">
      <div className="max-w-4xl mx-auto px-4 py-8" data-oid="yzgm.gf">
        {/* Story Header */}
        <div className="mb-8" data-oid="z4-su:_">
          <div className="flex items-center justify-between mb-4" data-oid="d-0:n7z">
            <button
              onClick={() => router.push('/explore')}
              className="text-purple-600 hover:text-purple-700 flex items-center"
              data-oid="f45cd6e"
            >
              ← Back to Explore
            </button>
            <span
              className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded"
              data-oid="opefizh"
            >
              {currentStory.ageTier}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2" data-oid="eh4_ijd">
            {currentStory.title}
          </h1>
          {currentStory.description && (
            <p className="text-gray-600 text-lg mb-4" data-oid=":z138yl">
              {currentStory.description}
            </p>
          )}

          <div className="flex items-center space-x-4 text-sm text-gray-500" data-oid=".kh59g_">
            <span data-oid="m6v78-m">Status: {currentStory.status}</span>
            <span data-oid="aa2cns:">•</span>
            <span data-oid="p6gxrqb">{currentStory.segments?.length || 0} segments</span>
            <span data-oid="u8jq87i">•</span>
            <span data-oid="fbtz4ov">{currentStory.collaborators?.length || 0} collaborators</span>
          </div>
        </div>

        {/* Story Segments */}
        <div className="space-y-6 mb-8" data-oid=".47fpfe">
          {currentStory.segments && currentStory.segments.length > 0 ? (
            currentStory.segments
              .sort((a, b) => a.position - b.position)
              .map(segment => (
                <StorySegmentDisplay
                  key={segment.id}
                  segment={segment}
                  isCurrentUserTurn={canContribute}
                  onEdit={handleEditSegment}
                  onAddChoice={handleAddChoiceToSegment}
                  data-oid="yn-zxpy"
                />
              ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg" data-oid="68rpvnl">
              <h3 className="text-xl font-semibold text-gray-700 mb-2" data-oid="4x:kwjr">
                No segments yet
              </h3>
              <p className="text-gray-500 mb-4" data-oid="yfqo:pa">
                This story is waiting for its first chapter.
              </p>
              {canContribute && (
                <p className="text-purple-600" data-oid="nwyu2sp">
                  Be the first to contribute!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Add Segment Form */}
        {canContribute && (
          <div className="bg-white border border-gray-200 rounded-lg p-6" data-oid="0.bcu5t">
            <h3 className="text-lg font-semibold text-gray-800 mb-4" data-oid="tf57sl4">
              Continue the Story
            </h3>
            <textarea
              value={currentUserInput}
              onChange={e => setCurrentUserInput(e.target.value)}
              placeholder="Write the next part of the story..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              disabled={isAddingSegment}
              data-oid="tbya2kb"
            />

            <div className="flex justify-between items-center mt-4" data-oid="u73r1uj">
              <span className="text-sm text-gray-500" data-oid="_-0g251">
                {currentUserInput.length} characters
              </span>
              <button
                onClick={handleAddSegment}
                disabled={!currentUserInput.trim() || isAddingSegment}
                className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                data-oid="a-8ul_3"
              >
                {isAddingSegment ? 'Adding...' : 'Add Segment'}
              </button>
            </div>
          </div>
        )}

        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8" data-oid="wv4hay6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2" data-oid="ibjpbwt">
              Join the Story
            </h3>
            <p className="text-blue-600 mb-4" data-oid="mbmr4.2">
              Sign in to contribute to this collaborative story.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
              data-oid="1:4a5j1"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Collaboration Sidebar - Simplified for now */}
        {currentStory.collaborators && currentStory.collaborators.length > 0 && (
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6" data-oid="ug3d1_j">
            <h3 className="text-lg font-semibold text-gray-800 mb-4" data-oid="e0p3:lo">
              Collaborators
            </h3>
            <div className="space-y-2" data-oid="opui:o8">
              {currentStory.collaborators.map(collab => (
                <div
                  key={collab.userId}
                  className="flex items-center justify-between"
                  data-oid="4:s08ql"
                >
                  <span className="text-gray-700" data-oid=".svkeg7">
                    {collab.userId}
                  </span>
                  <span
                    className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded"
                    data-oid="i4r:2jj"
                  >
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
