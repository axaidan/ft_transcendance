import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ChannelMute } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { NotFoundError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelMuteDto, EditChannelMuteDto } from './dto';

@Injectable()
export class ChannelMuteService {

    constructor(
        private prisma : PrismaService,
    ) {}

    async findOne(userId: number, chanId: number)
    : Promise<ChannelMute>
    {
        const channelMute = await this.prisma.channelMute.findUnique({
            where: { chanId_userId: { chanId: chanId, userId: userId } },
        });
        return channelMute;
    }

    async create(userId: number, chanId: number)
    : Promise<ChannelMute>
    {
        try {
            const now = new Date();
            const expires = new Date(now.setMinutes(now.getMinutes() + 5));
            const channelMute = await this.prisma.channelMute.create({
                data: {
                    chanId: chanId,
                    userId: userId,
                    muteExpires: expires,
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

    async delete(userId: number, chanId: number)
    : Promise<ChannelMute>
    {
        try {
            const channelMute = await this.prisma.channelMute.delete({
                where: { chanId_userId: { chanId: chanId, userId: userId } },
            });
            return channelMute;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                throw new NotFoundException('channelMute not found');
            }
        }
    }

    async edit(userId: number, chanId: number)
    : Promise<ChannelMute>
    {
        const oldChannelMute = await this.prisma.channelMute.findUnique({
            where: { chanId_userId: { chanId: chanId, userId: userId } },
        });
        const expires = new Date(oldChannelMute.muteExpires);
        expires.setMinutes(expires.getMinutes() + 5);
        const channelMute = await this.prisma.channelMute.update({
            where: { chanId_userId : { chanId: chanId, userId: userId } },
            data: { muteExpires: expires },
        });
        return channelMute;
    }

    async allExpired()
    : Promise<ChannelMute[]>
    {
        const now = new Date();
        const channelMutes = await this.prisma.channelMute.findMany({
            where: {
                muteExpires: { lt: now },
            },
        });
        return channelMutes;
    }

}
