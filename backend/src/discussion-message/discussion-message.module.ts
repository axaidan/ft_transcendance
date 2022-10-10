import { Module } from '@nestjs/common';
import { DiscMsgGateway } from './discussion-message.gateway';
import { DiscussionMessageService } from './discussion-message.service';

@Module({
  providers: [
    DiscussionMessageService,
    DiscMsgGateway
  ]
})
export class DiscussionMessageModule {}
