import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelUserModule } from './channel-user/channel-user.module';
import { ChannelUserService } from './channel-user/channel-user.service';
import { ChannelMuteModule } from './channel-mute/channel-mute.module';
import { ChannelBanModule } from './channel-ban/channel-ban.module';

@Module({
  imports: [
    ChannelUserModule,
    ChannelBanModule,
    ChannelMuteModule,
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
