import { Injectable, CanActivate, ExecutionContext, NotFoundException, Logger, BadRequestException, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ChannelMuteService } from '../channel-mute/channel-mute.service';

@Injectable()
export class NotMutedGuard implements CanActivate {

    constructor(
        private channelMuteService: ChannelMuteService,
    ) { }

    async canActivate(context: ExecutionContext)
        : Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        
        // const userId = request.user['id'];
        // const chanId = Number(request.params.chanId);
        const userId = request.body['userId'];
        const chanId = request.body['chanId'];
        if (Number.isInteger(userId) === false)
            throw new BadRequestException('userId must be an integer');
        if (Number.isInteger(chanId) === false)
            throw new BadRequestException('chanId must be an integer');

        const channelMute = await this.channelMuteService.findOne(userId, chanId);

        if (channelMute === null)
            return true;
        else
            throw new ForbiddenException('you are MUUUUUUUUUUUUUUUUTED in this channel');
    }
}