import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelUserModule } from './channel-user/channel-user.module';

@Module({
  imports: [
    ChannelUserModule,
  ],
  providers: [
    ChannelService,
  ],
  exports: [
    ChannelService,
  ],
})
export class ChannelModule {}
