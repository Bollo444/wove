# Notification Service

A comprehensive notification system for the Wove application that provides age-appropriate notifications, real-time delivery, and user preference management.

## Features

### Core Functionality
- **CRUD Operations**: Create, read, update, and delete notifications
- **Age-Appropriate Content**: Automatically adjusts notification content based on user's age tier (KIDS, TEENS, ADULTS)
- **User Preferences**: Customizable notification settings per user
- **Real-time Delivery**: Support for immediate notification delivery
- **Soft Delete**: Notifications are soft-deleted for data integrity
- **Expiration Management**: Automatic cleanup of expired notifications

### Notification Types
- **Story Notifications**: Updates about new stories, story interactions
- **Collaboration Notifications**: Invitations and collaboration updates
- **Social Notifications**: Friend requests, mentions, likes
- **Parental Notifications**: Content approval, time limits, safety alerts
- **System Notifications**: App updates, maintenance notices

### Priority Levels
- **LOW**: General updates and information
- **MEDIUM**: Important updates requiring attention
- **HIGH**: Urgent notifications
- **URGENT**: Critical alerts requiring immediate action

## API Endpoints

### User Endpoints

#### Get All Notifications
```http
GET /notifications
Authorization: Bearer <token>
Query Parameters:
  - limit: number (optional)
  - offset: number (optional)
  - unreadOnly: boolean (optional)
  - type: string (optional)
```

#### Get Unread Count
```http
GET /notifications/unread-count
Authorization: Bearer <token>
```

#### Get Notification Preferences
```http
GET /notifications/preferences/me
Authorization: Bearer <token>
```

#### Update Notification Preferences
```http
PATCH /notifications/preferences/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "emailNotifications": true,
  "pushNotifications": true,
  "storyUpdates": true,
  "collaborationInvites": true,
  "parentalAlerts": true,
  "systemAnnouncements": false
}
```

#### Get Single Notification
```http
GET /notifications/:id
Authorization: Bearer <token>
```

#### Mark Notification as Read
```http
PATCH /notifications/:id/read
Authorization: Bearer <token>
```

#### Mark All Notifications as Read
```http
PATCH /notifications/mark-all-read
Authorization: Bearer <token>
```

#### Delete Notification
```http
DELETE /notifications/:id
Authorization: Bearer <token>
```

### Admin/System Endpoints

#### Create Story Notification
```http
POST /notifications/story/:storyId
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "user-123",
  "storyTitle": "Adventure Story",
  "type": "new_story"
}
```

#### Create Collaboration Notification
```http
POST /notifications/collaboration/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "inviterName": "John Doe",
  "storyTitle": "Collaborative Story",
  "collaborationId": "collab-123"
}
```

#### Create Parental Notification
```http
POST /notifications/parental/:childId
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "content_approval",
  "details": {
    "contentId": "story-123",
    "contentTitle": "Story Title"
  }
}
```

## Service Methods

### NotificationService

#### Core CRUD Operations
- `create(createNotificationDto)`: Create a new notification
- `findAllForUser(userId, options)`: Get all notifications for a user with filtering
- `findOne(id, userId)`: Get a specific notification
- `markAsRead(id, userId)`: Mark notification as read
- `markAllAsRead(userId)`: Mark all user notifications as read
- `delete(id, userId)`: Soft delete a notification
- `getUnreadCount(userId)`: Get count of unread notifications

#### Specialized Notification Creation
- `createStoryNotification(userId, storyId, storyTitle, type)`: Create story-related notifications
- `createCollaborationNotification(userId, inviterName, storyTitle, collaborationId)`: Create collaboration invitations
- `createParentalNotification(childId, type, details)`: Create parental control notifications

#### User Preferences
- `getNotificationPreferences(userId)`: Get user's notification preferences
- `updateNotificationPreferences(userId, preferences)`: Update user's notification preferences

#### Maintenance
- `cleanupExpiredNotifications()`: Remove expired notifications (should be run periodically)

## Age-Appropriate Content

The notification service automatically adjusts content based on the user's age tier:

### KIDS (Under 13)
- Simple, encouraging language
- Focus on fun and creativity
- Parental oversight emphasized
- Limited action options

### TEENS (13-17)
- More detailed information
- Social interaction features
- Collaboration opportunities
- Balanced independence with safety

### ADULTS (18+)
- Full feature access
- Detailed notifications
- Advanced collaboration tools
- Complete control over settings

## Data Models

### Notification Entity
```typescript
{
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  actionUrl?: string;
  ageTierRelevant: AgeTier[];
  data?: Record<string, any>;
  relatedEntityId?: string;
  isRead: boolean;
  readAt?: Date;
  isActive: boolean;
  priority: NotificationPriority;
  expiresAt?: Date;
  requiresAction: boolean;
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
```

### Notification Preferences
```typescript
{
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  storyUpdates: boolean;
  collaborationInvites: boolean;
  parentalAlerts: boolean;
  systemAnnouncements: boolean;
}
```

## Security

- All endpoints require JWT authentication
- Users can only access their own notifications
- Age verification guards protect age-sensitive content
- Parental notifications respect family account structures

## Testing

The service includes comprehensive unit tests covering:
- CRUD operations
- Age-appropriate content generation
- User preference management
- Notification cleanup
- Error handling

Run tests with:
```bash
npm run test notification.service.spec.ts
```

## Future Enhancements

1. **Real-time WebSocket Integration**: Live notification delivery
2. **Email/SMS Integration**: External notification channels
3. **Push Notification Service**: Mobile app notifications
4. **Analytics Dashboard**: Notification engagement metrics
5. **Template System**: Customizable notification templates
6. **Batch Operations**: Bulk notification management
7. **Notification Scheduling**: Delayed notification delivery