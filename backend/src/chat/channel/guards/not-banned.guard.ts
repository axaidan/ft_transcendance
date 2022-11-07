import { Injectable, CanActivate, ExecutionContext, NotFoundException, Logger, BadRequestException, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ChannelBanService } from '../channel-ban/channel-ban.service';

@Injectable()
export class NotBannedGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        private channelBanService: ChannelBanService,
    ) { }

    async canActivate(context: ExecutionContext)
        : Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const userId = request.user['id'];
        const chanId = Number(request.params.chanId);
        if (Number.isInteger(chanId) === false)
            throw new BadRequestException(':chanId must be an integer');

        const channelBan = await this.channelBanService.findOne(userId, chanId);

        if (channelBan === null)
            return true;
        else
            throw new ForbiddenException('you are BAAAAAAAAAAAAAANNED from this channel');
    }
}