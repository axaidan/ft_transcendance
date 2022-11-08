import { Injectable, CanActivate, ExecutionContext, NotFoundException, Logger, BadRequestException, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { ChannelUserService } from '../channel-user/channel-user.service';

@Injectable()
export class TargetChannelUserJoined implements CanActivate {

    constructor(
        private channelUserService: ChannelUserService,
    ) { }

    async canActivate(context: ExecutionContext)
        : Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const chanId = Number(request.params.chanId);
        const userId = Number(request.params.userId);
        if (Number.isInteger(chanId) === false)
            throw new BadRequestException(':chanId must be an integer');
        if (Number.isInteger(userId) === false)
            throw new BadRequestException(':userId must be an integer');

        const channelUser = await this.channelUserService.findOne(userId, chanId);

        if (channelUser === null)
            throw new NotFoundException(`GUARD - channelUser (u:${userId},c:${chanId}) not found`);
        else
            return true;
    }
}