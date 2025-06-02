import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useStory } from '../../contexts/StoryContext';
// Assuming StoryCollaborator is exported from StoryContext or a shared types file
// For now, let's assume StoryContext exports StoryCollaborator type
// import { StoryCollaborator } from '../../contexts/StoryContext'; 
// TypingUser should be imported from where it's defined (e.g., types/collaboration.d.ts)
import { TypingUser } from '../../types/collaboration.d';


interface CollaboratorsPanelProps {
  // No longer taking collaborators or currentTurnUserId as props, will get from context
}

const CollaboratorsPanel: React.FC<CollaboratorsPanelProps> = () => {
  const { user } = useAuth();
  const { currentStory, activeTurnUserId, typingUsers, inviteCollaborator, isLoading: isStoryContextLoading } = useStory();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteInput, setInviteInput] = useState(''); // For email or username
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [isInviting, setIsInviting] = useState(false);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteInput.trim() || !currentStory) return;

    setIsInviting(true);
    setInviteError(null);
    setInviteSuccess(null);
    try {
      await inviteCollaborator(currentStory.id, inviteInput);
      setInviteSuccess(`Invitation sent to ${inviteInput}.`);
      setInviteInput('');
      setShowInviteModal(false);
    } catch (err: any) {
      setInviteError(err.message || 'Failed to send invitation.');
    } finally {
      setIsInviting(false);
    }
  };
  
  const collaboratorsToDisplay = currentStory?.collaborators || [];

  return (
    <>
      <div className="p-4 bg-gray-50 rounded-lg shadow h-full flex flex-col">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Collaborators</h3>
        {collaboratorsToDisplay.length === 0 ? (
          <p className="text-sm text-gray-500">No collaborators yet.</p>
        ) : (
          <ul className="space-y-2 overflow-y-auto flex-grow mb-3">
            {collaboratorsToDisplay.map(collab => {
              const isTyping = typingUsers.some(typingUser => typingUser.userId === collab.userId);
              const isCurrentUserTurn = activeTurnUserId === collab.userId;
              const avatarUrl = `https://picsum.photos/seed/${collab.userId}/40/40`; // Placeholder avatar

              return (
                <li
                  key={collab.userId}
                  className={`flex items-center p-2 rounded-md transition-colors ${isCurrentUserTurn ? 'bg-purple-100 border border-purple-300' : 'hover:bg-gray-100'}`}
                >
                  <img
                    src={avatarUrl}
                    alt={collab.username}
                    className="w-8 h-8 rounded-full mr-2 object-cover"
                  />
                  <span className={`text-sm ${isCurrentUserTurn ? 'font-semibold text-purple-700' : 'text-gray-800'}`}>
                    {collab.username}{collab.userId === user?.id ? ' (You)' : ''}
                  </span>
                  {isTyping && !isCurrentUserTurn && (
                    <span className="ml-auto text-xs text-purple-500 italic">typing...</span>
                  )}
                  {isCurrentUserTurn && (
                    <span className="ml-auto text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">
                      Turn
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        {currentStory && ( // Only show invite button if there's a story loaded
          <button onClick={() => { setShowInviteModal(true); setInviteError(null); setInviteSuccess(null); }} className="mt-auto w-full btn-secondary text-sm py-2">
            Invite Collaborator
          </button>
        )}
      </div>

      {/* Invite Collaborator Modal */}
      {showInviteModal && currentStory && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Invite Collaborator</h2>
            {inviteError && <p className="text-red-500 text-sm mb-3">{inviteError}</p>}
            {inviteSuccess && <p className="text-green-500 text-sm mb-3">{inviteSuccess}</p>}
            <form onSubmit={handleInviteSubmit}>
              <input
                type="text"
                value={inviteInput}
                onChange={e => setInviteInput(e.target.value)}
                placeholder="Enter email or username"
                className="input-field w-full mb-4"
                disabled={isInviting}
              />
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowInviteModal(false)} className="btn-secondary" disabled={isInviting}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isInviting || !inviteInput.trim()}>
                  {isInviting ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CollaboratorsPanel;
