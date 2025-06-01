import React, { useState, useEffect, useRef } from 'react';
// import { useAuth } from '../../contexts/AuthContext'; // Placeholder
// import { useWebSocket } from '../../contexts/WebSocketContext'; // Placeholder for WebSocket

// Placeholder type for chat message
interface ChatMessage {
  id: string;
  userId: string;
  userDisplayName: string;
  text: string;
  timestamp: Date;
}

// Dummy messages
const dummyMessages: ChatMessage[] = [
  {
    id: 'msg1',
    userId: 'user1',
    userDisplayName: 'StorytellerSam',
    text: 'Hey everyone, ready to continue?',
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: 'msg2',
    userId: 'user2',
    userDisplayName: 'WriterWendy',
    text: 'Yep! I have some ideas for the next part.',
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: 'msg3',
    userId: 'user1',
    userDisplayName: 'StorytellerSam',
    text: 'Great! What are you thinking?',
    timestamp: new Date(Date.now() - 180000),
  },
];

interface ChatInterfaceProps {
  storyId: string; // To scope messages to a story
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ storyId }) => {
  // const { user } = useAuth(); // Placeholder
  // const { messages, sendMessage, subscribeToStoryChat } = useWebSocket(); // Placeholder
  const [currentMessages, setCurrentMessages] = useState<ChatMessage[]>(dummyMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   // Subscribe to chat messages for this storyId when component mounts
  //   const unsubscribe = subscribeToStoryChat(storyId, (newMessage) => {
  //     setCurrentMessages(prev => [...prev, newMessage]);
  //   });
  //   return () => unsubscribe(); // Unsubscribe on unmount
  // }, [storyId, subscribeToStoryChat]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim() /*|| !user*/) return;

    const messageToSend = {
      // storyId,
      // userId: user.id,
      // userDisplayName: user.displayName,
      text: newMessage,
      // timestamp: new Date(),
    };
    console.log('Sending message (placeholder):', messageToSend);
    // sendMessage(messageToSend); // Actual WebSocket send

    // For placeholder UI update:
    setCurrentMessages(prev => [
      ...prev,
      {
        id: `msg${prev.length + 1}`,
        userId: 'currentUser',
        userDisplayName: 'Me',
        text: newMessage,
        timestamp: new Date(),
      },
    ]);
    setNewMessage('');
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Story Chat</h3>
      <div className="flex-grow overflow-y-auto mb-3 pr-2 space-y-3" style={{ maxHeight: '300px' }}>
        {' '}
        {/* Max height for scroll */}
        {currentMessages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.userId === 'currentUser' /*user?.id*/ ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg shadow ${msg.userId === 'currentUser' /*user?.id*/ ? 'bg-purple-500 text-white' : 'bg-white text-gray-800'}`}
            >
              <p className="text-xs font-semibold mb-0.5">{msg.userDisplayName}</p>
              <p className="text-sm">{msg.text}</p>
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
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="input-field flex-grow mr-2"
          // disabled={!user} // Disable if not logged in
        />
        <button
          type="submit"
          className="btn-primary px-4" /*disabled={!user || !newMessage.trim()}*/
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
