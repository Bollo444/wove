import React from 'react';
// import { User } from '@shared/types/user'; // Assuming shared User type

// Placeholder type for collaborator
interface Collaborator {
  id: string;
  displayName: string;
  avatarUrl?: string;
  isTyping?: boolean;
  isCurrentTurn?: boolean;
}

// Dummy data
const dummyCollaborators: Collaborator[] = [
  {
    id: 'user1',
    displayName: 'StorytellerSam',
    avatarUrl: 'https://picsum.photos/seed/sam/40/40',
    isCurrentTurn: true,
  },
  {
    id: 'user2',
    displayName: 'WriterWendy',
    avatarUrl: 'https://picsum.photos/seed/wendy/40/40',
    isTyping: true,
  },
  { id: 'user3', displayName: 'ReaderRick', avatarUrl: 'https://picsum.photos/seed/rick/40/40' },
];

interface CollaboratorsPanelProps {
  collaborators?: Collaborator[]; // Would come from story state / WebSocket
  currentTurnUserId?: string | null;
  onInviteCollaborator?: () => void; // Function to open invite modal
}

const CollaboratorsPanel: React.FC<CollaboratorsPanelProps> = ({
  collaborators = dummyCollaborators, // Use dummy data for now
  currentTurnUserId, // Would be used to highlight current turn
  onInviteCollaborator,
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow" data-oid="_-ct7vj">
      <h3 className="text-lg font-semibold text-gray-700 mb-3" data-oid="w5tbn:_">
        Collaborators
      </h3>
      {collaborators.length === 0 ? (
        <p className="text-sm text-gray-500" data-oid="u0coq6o">
          No collaborators yet. Invite someone!
        </p>
      ) : (
        <ul className="space-y-2" data-oid="8x-.qq3">
          {collaborators.map(collab => (
            <li
              key={collab.id}
              className={`flex items-center p-2 rounded-md transition-colors ${collab.isCurrentTurn || collab.id === currentTurnUserId ? 'bg-purple-100 border border-purple-300' : 'hover:bg-gray-100'}`}
              data-oid="8y6:yj7"
            >
              <img
                src={collab.avatarUrl || '/default-avatar.png'}
                alt={collab.displayName}
                className="w-8 h-8 rounded-full mr-2 object-cover"
                data-oid="v0ot0r_"
              />

              <span
                className={`text-sm ${collab.isCurrentTurn || collab.id === currentTurnUserId ? 'font-semibold text-purple-700' : 'text-gray-800'}`}
                data-oid="a2q5.g9"
              >
                {collab.displayName}
              </span>
              {collab.isTyping && (
                <span className="ml-auto text-xs text-purple-500 italic" data-oid="cg72ov7">
                  typing...
                </span>
              )}
              {(collab.isCurrentTurn || collab.id === currentTurnUserId) && (
                <span
                  className="ml-auto text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full"
                  data-oid="ui0d0yh"
                >
                  Turn
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      {onInviteCollaborator && (
        <button
          onClick={onInviteCollaborator}
          className="mt-4 w-full btn-secondary text-sm"
          data-oid="27ri.ja"
        >
          Invite Collaborator
        </button>
      )}
      {!onInviteCollaborator && ( // Fallback if no handler provided
        <button
          onClick={() => alert('Invite functionality not implemented.')}
          className="mt-4 w-full btn-secondary text-sm"
          data-oid="eyi0w4g"
        >
          Invite Collaborator (Placeholder)
        </button>
      )}
    </div>
  );
};

export default CollaboratorsPanel;
