import { Module } from '@nestjs/common';
import { ChannelMuteService } from './channel-mute.service';

@Module({
  providers: [ChannelMuteService],
  exports: [ChannelMuteService],
})
export class ChannelMuteModule {}
