# WebSocket Notification Integration

This document describes the real-time notification system implemented using WebSocket technology in the Wove application.

## Overview

The WebSocket notification system provides real-time delivery of notifications to connected users, enabling instant updates for:
- New notifications
- Read status changes
- Unread count updates
- System announcements
- User presence updates

## Architecture

### Components

1. **NotificationGateway** (`notification.gateway.ts`)
   - WebSocket gateway handling notification-specific events
   - Manages user connections and rooms
   - Provides real-time notification delivery

2. **NotificationService** (Enhanced)
   - Integrated with WebSocket gateway for real-time delivery
   - Sends notifications immediately upon creation
   - Updates clients on read status changes

3. **WebSocketModule** (Enhanced)
   - Manages circular dependency between service and gateway
   - Initializes connections after module setup

## WebSocket Events

### Client → Server Events

#### `get_notifications`
```typescript
// Request user's notifications with pagination
socket.emit('get_notifications', {
  page: 1,
  limit: 20
});
```

#### `get_preferences`
```typescript
// Request user's notification preferences
socket.emit('get_preferences');
```

#### `update_preferences`
```typescript
// Update user's notification preferences
socket.emit('update_preferences', {
  emailNotifications: true,
  pushNotifications: false,
  storyNotifications: true,
  collaborationNotifications: true,
  parentalNotifications: true
});
```

#### `mark_as_read`
```typescript
// Mark a specific notification as read
socket.emit('mark_as_read', {
  notificationId: 'notification-uuid'
});
```

#### `mark_all_as_read`
```typescript
// Mark all notifications as read
socket.emit('mark_all_as_read');
```

#### `get_notification_history`
```typescript
// Get notification history with filters
socket.emit('get_notification_history', {
  page: 1,
  limit: 50,
  type: 'story', // optional filter
  startDate: '2024-01-01', // optional
  endDate: '2024-12-31' // optional
});
```

### Server → Client Events

#### `notification`
```typescript
// New notification received
socket.on('notification', (data) => {
  console.log('New notification:', data);
  // {
  //   type: 'new_notification',
  //   data: {
  //     id: 'notification-uuid',
  //     title: 'New Story Published',
  //     content: 'Check out the latest story...',
  //     type: 'story',
  //     priority: 'medium',
  //     actionUrl: '/stories/story-id',
  //     createdAt: '2024-01-15T10:30:00Z'
  //   },
  //   timestamp: '2024-01-15T10:30:00Z'
  // }
});
```

#### `notification_update`
```typescript
// Notification status update
socket.on('notification_update', (data) => {
  console.log('Notification update:', data);
  // {
  //   type: 'notification_read',
  //   notificationId: 'notification-uuid',
  //   unreadCount: 3,
  //   timestamp: '2024-01-15T10:35:00Z'
  // }
});
```

#### `unread_count`
```typescript
// Initial unread count on connection
socket.on('unread_count', (data) => {
  console.log('Unread notifications:', data.count);
});
```

#### `recent_notifications`
```typescript
// Recent unread notifications on connection
socket.on('recent_notifications', (data) => {
  console.log('Recent notifications:', data.notifications);
});
```

#### `system_notification`
```typescript
// System-wide announcements
socket.on('system_notification', (data) => {
  console.log('System notification:', data);
  // {
  //   type: 'system_announcement',
  //   data: {
  //     title: 'System Maintenance',
  //     content: 'Scheduled maintenance tonight...',
  //     priority: 'high'
  //   },
  //   timestamp: '2024-01-15T10:40:00Z'
  // }
});
```

## Authentication

WebSocket connections require JWT authentication:

```typescript
const socket = io('/notifications', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

## Connection Management

### User Rooms
- Each authenticated user joins a room: `user_{userId}`
- Enables targeted notification delivery
- Automatic cleanup on disconnection

### Connection Tracking
- Active connections stored in memory
- User presence tracking
- Connection count monitoring

## Real-time Features

### Immediate Notification Delivery
```typescript
// When a notification is created
const notification = await notificationService.create({
  userId: 'user-123',
  type: 'story',
  title: 'New Story Available',
  content: 'A new story has been published...'
});

// Automatically sent via WebSocket to connected user
```

### Read Status Synchronization
```typescript
// When user marks notification as read
await notificationService.markAsRead('notification-id', 'user-123');

// Real-time update sent to user:
// - Updated read status
// - New unread count
```

### Bulk Operations
```typescript
// Mark all as read
await notificationService.markAllAsRead('user-123');

// Real-time update: unread count = 0
```

## Integration Examples

### Frontend Integration (React)

```typescript
import { io, Socket } from 'socket.io-client';

class NotificationService {
  private socket: Socket;
  private unreadCount = 0;

  constructor(token: string) {
    this.socket = io('/notifications', {
      auth: { token }
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    // New notification
    this.socket.on('notification', (data) => {
      this.showNotificationToast(data.data);
      this.updateUnreadCount(this.unreadCount + 1);
    });

    // Notification updates
    this.socket.on('notification_update', (data) => {
      if (data.type === 'notification_read') {
        this.updateUnreadCount(data.unreadCount);
      } else if (data.type === 'all_notifications_read') {
        this.updateUnreadCount(0);
      }
    });

    // Initial unread count
    this.socket.on('unread_count', (data) => {
      this.updateUnreadCount(data.count);
    });

    // System notifications
    this.socket.on('system_notification', (data) => {
      this.showSystemAlert(data.data);
    });
  }

  markAsRead(notificationId: string) {
    this.socket.emit('mark_as_read', { notificationId });
  }

  markAllAsRead() {
    this.socket.emit('mark_all_as_read');
  }

  getNotifications(page = 1, limit = 20) {
    return new Promise((resolve) => {
      this.socket.emit('get_notifications', { page, limit });
      this.socket.once('notifications_response', resolve);
    });
  }

  private showNotificationToast(notification: any) {
    // Show toast notification
  }

  private updateUnreadCount(count: number) {
    this.unreadCount = count;
    // Update UI badge
  }

  private showSystemAlert(notification: any) {
    // Show system alert
  }
}
```

### Backend Service Integration

```typescript
// In any service that needs to send notifications
@Injectable()
export class StoryService {
  constructor(
    private notificationService: NotificationService
  ) {}

  async publishStory(storyId: string, authorId: string) {
    // Publish story logic...
    
    // Send notification to followers
    const followers = await this.getFollowers(authorId);
    
    for (const follower of followers) {
      await this.notificationService.createStoryNotification(
        follower.id,
        'story_published',
        storyId,
        'New Story Published'
      );
      // Notification automatically sent via WebSocket
    }
  }
}
```

## Error Handling

### Connection Errors
```typescript
socket.on('connect_error', (error) => {
  console.error('Connection failed:', error);
  // Handle authentication errors
  // Implement reconnection logic
});
```

### Event Errors
```typescript
socket.on('error', (error) => {
  console.error('Socket error:', error);
  // Handle specific error types
});
```

## Performance Considerations

### Memory Management
- Connected users map cleaned on disconnect
- Automatic room cleanup
- Limited notification history in memory

### Scalability
- Redis adapter for multi-instance deployment
- Room-based targeting reduces broadcast overhead
- Efficient user lookup mechanisms

### Rate Limiting
- Client event rate limiting
- Notification frequency controls
- Connection throttling

## Security

### Authentication
- JWT token validation on connection
- User-specific room isolation
- Token refresh handling

### Authorization
- User can only access own notifications
- Admin-only system broadcasts
- Secure room naming conventions

## Monitoring

### Metrics
- Connected users count
- Notification delivery rates
- Connection success/failure rates
- Event processing times

### Logging
- Connection events
- Notification delivery
- Error tracking
- Performance metrics

## Testing

Comprehensive test suite includes:
- Connection handling
- Event processing
- Authentication flows
- Error scenarios
- Integration tests

Run tests:
```bash
npm run test notification.gateway.spec.ts
```

## Future Enhancements

1. **Push Notifications**
   - Mobile push notification integration
   - Web push notifications
   - Notification preferences sync

2. **Advanced Features**
   - Notification scheduling
   - Batch notification delivery
   - Notification templates
   - A/B testing for notifications

3. **Analytics**
   - Notification engagement tracking
   - Delivery success rates
   - User interaction patterns

4. **Offline Support**
   - Notification queuing for offline users
   - Sync on reconnection
   - Persistent notification storage

## Troubleshooting

### Common Issues

1. **Connection Failures**
   - Check JWT token validity
   - Verify CORS configuration
   - Check network connectivity

2. **Missing Notifications**
   - Verify user is connected
   - Check room membership
   - Validate notification creation

3. **Performance Issues**
   - Monitor connection count
   - Check Redis connectivity
   - Review notification frequency

### Debug Mode

Enable debug logging:
```typescript
const socket = io('/notifications', {
  auth: { token },
  debug: true
});
```

## Conclusion

The WebSocket notification system provides a robust, real-time communication channel for the Wove application, ensuring users receive immediate updates about relevant activities while maintaining security and performance standards.