import { Module } from '@nestjs/common';
import { ChatGateway } from 'src/chat/chat.gateway';
import { DiscussionModule } from 'src/chat/discussion/discussion.module';
import { DiscussionService } from './discussion/discussion.service';

@Module({
    imports: [
        DiscussionModule,
    ],
    providers: [
        // ChatGateway,
    ],
})
export class ChatModule {}
