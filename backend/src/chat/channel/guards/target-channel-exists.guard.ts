import { Injectable, CanActivate, ExecutionContext, NotFoundException, Logger, BadRequestException, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { ChannelService } from '../channel.service';

@Injectable()
export class TargetChannelExists implements CanActivate {

    constructor(
        private channelService: ChannelService,
    ) { }

    async canActivate(context: ExecutionContext)
        : Promise<boolean> {

        const request = context.switchToHttp().getRequest();
        const chanId = Number(request.params.chanId);
        if (Number.isInteger(chanId) === false)
            throw new BadRequestException(':chanId must be an integer');

        const channel = await this.channelService.findOne(chanId);

        if (channel === null)
            throw new NotFoundException(`GUARD - channel ${chanId} not found`);
        else
            return true;
    }
}