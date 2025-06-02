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
  const { 
    currentStory, 
    isLoading, 
    loadStory, 
    addSegment, 
    requestStoryConclusion, 
    activeTurnUserId, 
    isSocketConnected,
    generateBook 
  } = useStory();

  const [error, setError] = useState<string | null>(null);
  const [isEndingStory, setIsEndingStory] = useState(false);
  const [currentUserInput, setCurrentUserInput] = useState('');
  const [applyAutoFix, setApplyAutoFix] = useState(true);
  const [isAddingSegment, setIsAddingSegment] = useState(false);
  const [isGeneratingBook, setIsGeneratingBook] = useState(false);

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
      // Pass applyAutoFix state to addSegment
      await addSegment(currentStory.id, currentUserInput.trim(), applyAutoFix);
      setCurrentUserInput('');
    } catch (err: any) {
      setError(err.message || 'Failed to add segment.');
    } finally {
      setIsAddingSegment(false);
    }
  };

  const handleRequestStoryConclusion = async () => {
    if (!currentStory) return;
    setIsEndingStory(true);
    setError(null);
    try {
      await requestStoryConclusion(currentStory.id);
      // Story status will be updated via WebSocket message (STORY_UPDATED or STORY_CONCLUDED)
      // Optionally, can provide immediate feedback like "Conclusion request sent..."
    } catch (err: any)
      setError(err.message || 'Failed to request story conclusion.');
    } finally {
      setIsEndingStory(false);
    }
  };
  
  const handleGenerateBook = async () => {
    if (!currentStory) return;
    setIsGeneratingBook(true);
    setError(null);
    try {
      const response = await generateBook(currentStory.id);
      // response might include { bookId, status, message }
      // If status is 'COMPLETED' or 'GENERATING' and bookId is present, navigate.
      // If status is 'PENDING' or similar, might show message from response.
      if (response.bookId) {
        router.push(`/book/${response.bookId}`);
      } else if (response.message) {
        // Handle cases where book generation might be pending or already exists without immediate navigation
        alert(response.message); 
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate or view book.');
      alert(`Error: ${err.message || 'Failed to generate or view book.'}`);
    } finally {
      setIsGeneratingBook(false);
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
    ) || !currentStory.isPrivate // Assuming public stories allow contribution by any logged-in user for now
  );
  
  // More specific check if it's exactly this user's turn
  const isCurrentUserActualTurn = user && activeTurnUserId === user.id;
  // Or if it's AI's turn (could allow user to trigger AI or just wait)
  const isAITurn = activeTurnUserId === 'ai' || activeTurnUserId === 'AI'; 

  // Determine if input should be enabled
  // Simple version: if user can contribute and (it's their turn OR no specific turn is set OR it's AI's turn and user can prompt AI)
  // For now, let's use `canContribute` as the primary gate, and `activeTurnUserId` as info.
  // A more complex setup would disable input if `activeTurnUserId` is set and not current user.
  const isInputDisabled = isAddingSegment || 
                          !currentStory || 
                          currentStory.status === 'completed' ||
                          (activeTurnUserId && activeTurnUserId !== user?.id && activeTurnUserId !== 'ai' && activeTurnUserId !== 'AI');


  // Function to get display name for current turn
  const getTurnDisplayName = () => {
    if (!activeTurnUserId) return 'Anyone';
    if (activeTurnUserId === 'ai' || activeTurnUserId === 'AI') return 'AI';
    const turnUser = currentStory?.collaborators.find(c => c.userId === activeTurnUserId);
    return turnUser?.username || activeTurnUserId; // Fallback to ID if username not found
  };

  return (
    <Layout title={currentStory.title}>
      <div className="flex flex-col lg:flex-row gap-4 px-4 py-8 max-w-full mx-auto">
        {/* Left Sidebar: Collaborators Panel */}
        {/* Ensure currentStory is not null before trying to access its properties */}
        {currentStory && (
          <div className="w-full lg:w-1/4 lg:max-w-xs xl:max-w-sm flex-shrink-0 order-1 lg:order-none">
            <CollaboratorsPanel
              // collaborators={currentStory.collaborators} // Will be connected later via context
              // currentTurnUserId={activeTurnUserId} // Will be connected later
              // onInviteCollaborator={() => console.log("Invite clicked")} // Placeholder
            />
          </div>
        )}

        {/* Main Content: Story Details and Segments */}
        <div className="flex-grow lg:w-1/2 order-3 lg:order-none min-w-0"> {/* min-w-0 for flex child overflow handling */}
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
          
          <div className="flex flex-wrap items-center space-x-4 text-sm text-gray-500">
            <span>Status: <span className="font-semibold">{currentStory.status}</span></span>
            <span>•</span>
            <span><span className="font-semibold">{currentStory.segments?.length || 0}</span> segments</span>
            <span>•</span>
            <span><span className="font-semibold">{currentStory.collaborators?.length || 0}</span> collaborators</span>
            {isSocketConnected && activeTurnUserId && (
              <>
                <span>•</span>
                <span>Current Turn: <span className="font-semibold">{getTurnDisplayName()}</span></span>
              </>
            )}
             {isSocketConnected === false && (
                <>
                <span>•</span>
                <span className="text-yellow-600 font-semibold">Connecting to story...</span>
                </>
            )}
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
              placeholder={isCurrentUserActualTurn || (activeTurnUserId && (activeTurnUserId === 'ai' || activeTurnUserId === 'AI') && canContribute) || (!activeTurnUserId && canContribute) ? "Write the next part of the story..." : "Waiting for your turn..."}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              disabled={isInputDisabled}
            />
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-3 sm:space-y-0">
              <div className="flex items-center self-start sm:self-center">
                <input
                  type="checkbox"
                  id="autoFixToggle"
                  checked={applyAutoFix}
                  onChange={(e) => setApplyAutoFix(e.target.checked)}
                  className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="autoFixToggle" className="ml-2 text-sm text-gray-600">
                  Enable Auto-Fix (AI text enhancement)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {currentUserInput.length} characters
                </span>
                <button
                  onClick={handleAddSegment}
                  disabled={isInputDisabled || !currentUserInput.trim()}
                  className="btn-primary px-6 py-2"
                >
                  {isAddingSegment ? 'Adding...' : 'Add Segment'}
                </button>
              </div>
            </div>
            {currentStory && currentStory.status !== 'completed' && canContribute && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleRequestStoryConclusion}
                  disabled={isEndingStory}
                  className="btn-secondary px-6 py-2 border-red-500 text-red-600 hover:bg-red-50"
                >
                  {isEndingStory ? 'Ending Story...' : 'Request Story Conclusion'}
                </button>
              </div>
            )}
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
        
        {/* End of Main Story Content Area. Original simplified collaborator list removed. */}
        </div>


        {/* Right Sidebar: Chat Interface */}
        {/* Ensure currentStory is not null before trying to access its properties */}
        {currentStory && (
          <div className="w-full lg:w-1/4 lg:max-w-xs xl:max-w-sm flex-shrink-0 order-2 lg:order-none">
            <ChatInterface storyId={storyId} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StoryPage;
