import { Injectable, CanActivate, ExecutionContext, NotFoundException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ChannelBanService } from '../channel-ban/channel-ban.service';
import { ChannelMuteService } from '../channel-mute/channel-mute.service';
import { ChannelUserService } from '../channel-user/channel-user.service';

@Injectable()
export class ForbiddenStatusGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        private channelUserService: ChannelUserService,
        private channelMuteService: ChannelMuteService,
        private channelBanService: ChannelBanService,
    ) { }

    async canActivate(context: ExecutionContext)
        : Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const currentUserId = request.user['id'];
        const chanId = request.body['chanId'];
        const userId = request.body['userId'];

        const currentChannelUser = await this.channelUserService.findOne(currentUserId, chanId);
        if (currentChannelUser === null)
            throw new NotFoundException('you are not in channel');
        const channelUser = await this.channelUserService.findOne(userId, chanId);
        if (channelUser === null)
            throw new NotFoundException('user not in channel');

        const forbiddenStatus = this.reflector.get<string[]>('status', context.getHandler());
        if (!forbiddenStatus) {
            return true;
        }

        // console.log(`forbiddenStatus = ${roles}`)
        
        if (forbiddenStatus[0] === 'mute') {
            const channelMute = await this.channelMuteService.findOne(userId, chanId);
            if (channelMute !== null)
                return false;
        }
        if (forbiddenStatus[0] === 'ban') {
            const channelBan = await this.channelBanService.findOne(userId, chanId);
            if (channelBan !== null)
                return false;
        }
        // console.log(`returning false`);
        return true;
    }
}