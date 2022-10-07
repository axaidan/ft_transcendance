import { Module } from '@nestjs/common';
import { DiscussionMessageModule } from 'src/discussion-message/discussion-message.module';
import { DiscussionMessageService } from 'src/discussion-message/discussion-message.service';
import { DiscussionController } from './discussion.controller';
import { DiscussionService } from './discussion.service';

@Module({
    imports: [DiscussionMessageModule],
    controllers: [DiscussionController],
    providers: [DiscussionService, DiscussionMessageService],
})
export class DiscussionModule {}
