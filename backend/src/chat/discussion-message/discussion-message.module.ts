import { Module } from '@nestjs/common';
import { DiscussionMessageService } from './discussion-message.service';

@Module({
  providers: [
    DiscussionMessageService
  ],
  exports: [
    DiscussionMessageService,
  ]
})
export class DiscussionMessageModule {}
