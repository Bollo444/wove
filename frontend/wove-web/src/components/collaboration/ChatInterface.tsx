import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useStory } from '../../contexts/StoryContext';
import { ChatMessage } from '../../types/collaboration.d'; // Import ChatMessage type

interface ChatInterfaceProps {
  storyId: string; 
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ storyId }) => {
  const { user } = useAuth();
  const { chatMessages, sendChatMessage, sendTypingActivity, isSocketConnected } = useStory();
  
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    if (!user || !storyId || !isSocketConnected) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    } else {
      // Send isTyping: true immediately on first key press
      sendTypingActivity(storyId, true);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingActivity(storyId, false);
      typingTimeoutRef.current = null; 
    }, 3000); // Send isTyping: false after 3 seconds of inactivity
  };
  
  const handleInputBlur = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (user && storyId && isSocketConnected) {
      sendTypingActivity(storyId, false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !storyId) return;

    if (typingTimeoutRef.current) { // Clear typing timeout on send
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
      sendTypingActivity(storyId, false); // Explicitly send false on message send
    }

    try {
      await sendChatMessage(storyId, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send chat message:', error);
      // Optionally display an error message to the user
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Story Chat</h3>
      <div className="flex-grow overflow-y-auto mb-3 pr-2 space-y-3" style={{ minHeight: '200px', maxHeight: 'calc(100vh - 300px)' }}> {/* Adjusted height */}
        {chatMessages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.userId === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg shadow ${msg.userId === user?.id ? 'bg-purple-600 text-white' : 'bg-white text-gray-800'}`}
            >
              <p className="text-xs font-semibold mb-0.5">
                {msg.username}{msg.userId === user?.id ? ' (You)' : ''}
              </p>
              <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
              <p className="text-xs opacity-70 mt-1 text-right">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          onBlur={handleInputBlur} // Send typing false when input loses focus
          placeholder={user && isSocketConnected ? "Type your message..." : "Chat unavailable"}
          className="input-field flex-grow mr-2"
          disabled={!user || !isSocketConnected}
        />
        <button
          type="submit"
          className="btn-primary px-4"
          disabled={!user || !isSocketConnected || !newMessage.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
