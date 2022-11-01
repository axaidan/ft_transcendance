import { Module } from '@nestjs/common';
import { ChannelBanService } from './channel-ban.service';

@Module({
  providers: [ChannelBanService],
  exports: [ChannelBanService],
})
export class ChannelBanModule {}
