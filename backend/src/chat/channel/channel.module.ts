import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelUserModule } from './channel-user/channel-user.module';
import { ChannelUserService } from './channel-user/channel-user.service';

@Module({
  imports: [
    ChannelUserModule,
  ],
  providers: [
    ChannelService,
    ChannelUserService,
  ],
  exports: [
    ChannelService,
    ChannelUserService,
  ],
})
export class ChannelModule {}
