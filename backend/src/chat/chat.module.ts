import { Module } from '@nestjs/common';
import { ChatGateway } from 'src/chat/chat.gateway';
import { DiscussionModule } from 'src/chat/discussion/discussion.module';
import { DiscussionService } from './discussion/discussion.service';
import { ChatService } from './chat.service';
import { ChannelModule } from './channel/channel.module';
import { ChatController } from './chat.controller';

@Module({
    imports: [
        DiscussionModule,
        ChannelModule,
    ],
    controllers: [
        ChatController,
    ],
    providers: [
        ChatService,
        ChatGateway,
    ],
})
export class ChatModule {}
