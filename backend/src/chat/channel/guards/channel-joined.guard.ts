import { Injectable, CanActivate, ExecutionContext, NotFoundException, Logger, BadRequestException, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { ChannelUserService } from '../channel-user/channel-user.service';

@Injectable()
export class ChannelJoined implements CanActivate {

    constructor(
        private channelUserService: ChannelUserService,
    ) { }

    async canActivate(context: ExecutionContext)
        : Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const currentUserId = request.user['id'];
        const chanId = Number(request.params.chanId);
        if (Number.isInteger(chanId) === false)
            throw new BadRequestException(':chanId must be an integer');

        const channelUser = await this.channelUserService.findOne(currentUserId, chanId);

        if (channelUser === null)
            throw new ForbiddenException('GUARD - channel not joined');
        else
            return true;
    }
}