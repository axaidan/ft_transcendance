import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ChannelMute } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { NotFoundError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelMuteDto, CreateChannelMuteDto, EditChannelMuteDto } from './dto';

@Injectable()
export class ChannelMuteService {

    constructor(
        private prisma : PrismaService,
    ) {}

    async findOne(userId: number, chanId: number)
    : Promise<ChannelMute>
    {
        const channelMute = await this.prisma.channelMute.findUnique({
            where: { channelId_userId: { channelId: chanId, userId: userId } },
        });
        return channelMute;
    }

    async create(dto: CreateChannelMuteDto)
    : Promise<ChannelMute>
    {
        try {
            const now = new Date();
            const expires = new Date(dto.expires);
            // console.log(`expires\t=\t${dto.expires}`);
            // console.log(`now\t\t=\t${now}`)
            // console.log(`expires < now = ${expires < now}`);
            if (expires < now)
                throw new ForbiddenException('expiration must be in the future')
            const channelMute = await this.prisma.channelMute.create({
                data: {
                    channelId: dto.chanId,
                    userId: dto.userId,
                    muteExpires: dto.expires,
                },
            });
            return channelMute;
        } catch (e) {
            if (e instanceof ForbiddenException)
                throw e;
            else if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new ForbiddenException('channelMute already exists');
                }
            }
        }
    }

    async delete(dto: ChannelMuteDto)
    : Promise<ChannelMute>
    {
        try {
            const channelMute = await this.prisma.channelMute.delete({
                where: { channelId_userId: { channelId: dto.chanId, userId: dto.userId } },
            });
            return channelMute;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                throw new NotFoundException('channelMute not found');
            }
        }
    }

    async edit(dto: EditChannelMuteDto)
    : Promise<ChannelMute>
    {
        const now = new Date();
        const expires = new Date(dto.expires);
        if (expires < now)
            throw new ForbiddenException('expiration must be in the future')
        const channelMute = await this.prisma.channelMute.update({
            where: { channelId_userId : { channelId: dto.chanId, userId: dto.userId } },
            data: { muteExpires: dto.expires },
        });
        return channelMute;
    }

}
