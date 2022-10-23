import { Module } from '@nestjs/common';
import { ChannelUserService } from './channel-user.service';

@Module({
    providers: [
        ChannelUserService
    ],
    exports: [
        ChannelUserService
    ],
})
export class ChannelUserModule { }
