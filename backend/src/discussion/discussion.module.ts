import { Module } from '@nestjs/common';
import { DiscussionController } from './discussion.controller';
import { DiscussionService } from './discussion.service';

@Module({
  controllers: [DiscussionController],
  providers: [DiscussionService]
})
export class DiscussionModule {}
