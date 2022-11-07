import { Module } from '@nestjs/common';
import { ChannelUserService } from './channel-user.service';
import { ChannelBanModule } from '../channel-ban/channel-ban.module';
import { ChannelMuteModule } from '../channel-mute/channel-mute.module';

@Module({
    providers: [
        ChannelUserService
    ],
    exports: [
        ChannelUserService
    ],
    imports: [ChannelBanModule, ChannelMuteModule],
})
export class ChannelUserModule { }
