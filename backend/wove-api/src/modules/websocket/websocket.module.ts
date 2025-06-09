import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { StoryGateway } from './gateways/websocket.gateway';
import { WebSocketService } from './services/websocket.service';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { NotificationGateway } from './gateways/notification.gateway';
import { NotificationModule } from '../../notifications/notification.module';
import { NotificationService } from '../../notifications/notification.service';

@Module({
  imports: [ConfigModule, AuthModule, UsersModule, NotificationModule],
  providers: [StoryGateway, WebSocketService, NotificationGateway],
  exports: [WebSocketService, NotificationGateway],
})
export class WebSocketModule implements OnModuleInit {
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    // Set up the circular dependency after module initialization
    const notificationService = this.moduleRef.get(NotificationService, { strict: false });
    const notificationGateway = this.moduleRef.get(NotificationGateway, { strict: false });
    
    if (notificationService && notificationGateway) {
      notificationService.setNotificationGateway(notificationGateway);
    }
  }
}
