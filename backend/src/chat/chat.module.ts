import { Module } from '@nestjs/common';
import { ChatGateway } from 'src/chat/chat.gateway';
import { DiscussionModule } from 'src/chat/discussion/discussion.module';
import { ChatService } from './chat.service';
import { ChannelModule } from './channel/channel.module';
import { ChatController } from './chat.controller';
import { RelationModule } from 'src/relations/relation.module';
import { RelationService } from 'src/relations/relation.service';
import { UserModule } from 'src/users/users.module';
import { UserService } from 'src/users/users.service';
import { ChannelUserModule } from './channel/channel-user/channel-user.module';
import { ChannelUserService } from './channel/channel-user/channel-user.service';

@Module({
    imports: [
        UserModule,
        DiscussionModule,
        ChannelModule,
        ChannelUserModule,
    ],
    controllers: [
        ChatController,
    ],
    providers: [
        ChatService,
        ChatGateway,
        UserService,
        ChannelUserService,
    ],
})
export class ChatModule {}
