import { Module } from '@nestjs/common';
import { ChannelMessageService } from './channel-message.service';

@Module({
  providers: [
    ChannelMessageService
  ],
  exports: [
    ChannelMessageService,
  ],
})
export class ChannelMessageModule { }
