import { Module } from '@nestjs/common';
import { DiscussionController } from './discussion.controller';
import { DiscussionService } from './discussion.service';
import { DiscussionMessageModule } from '../discussion-message/discussion-message.module';
import { DiscussionMessageService } from '../discussion-message/discussion-message.service';

@Module({
	imports: [DiscussionMessageModule],
	controllers: [DiscussionController],
	providers: [DiscussionService, DiscussionMessageService],
})
export class DiscussionModule { }
