export interface ChatMessage {
  id: string; // Unique message ID
  storyId: string;
  userId: string;
  username: string; // Display name of the sender
  text: string;
  timestamp: string | Date; // ISO string or Date object
}

export interface TypingUser {
  userId: string;
  username: string; // Display name of the typing user
}
