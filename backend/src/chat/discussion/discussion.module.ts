import { Module } from '@nestjs/common';
import { DiscussionMessageModule } from 'src/chat/discussion-message/discussion-message.module';
import { DiscussionMessageService } from 'src/chat/discussion-message/discussion-message.service';
import { ChatGateway } from '../chat.gateway';
import { DiscussionController } from './discussion.controller';
import { DiscussionService } from './discussion.service';

@Module({
    imports: [
        DiscussionMessageModule,
    ],
    // controllers: [
    //     // DiscussionController,
    // ],
    providers: [
        DiscussionService,
        DiscussionMessageService,
        // ChatGateway,
    ],
    exports: [
        DiscussionService,
        DiscussionMessageService,
    ]
})
export class DiscussionModule {}