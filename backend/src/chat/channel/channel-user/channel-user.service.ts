import { Injectable } from '@nestjs/common';
import { ChannelUser } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { EChannelStatus } from './types';

@Injectable()
export class ChannelUserService {
    constructor (
        private prisma: PrismaService,
    ) {}

    async getAllNonBannedChannelUsers(userId: number):
    Promise<ChannelUser[]>
    {
        const channelUsers : ChannelUser[] = await this.prisma.channelUser.findMany({
            where: {
                userId: userId,
                status: { not: EChannelStatus.BANNED },
            },
        });
        return channelUsers;
    }

    async findOne(userId: number, chanId: number) {
        const channelUser: ChannelUser = await this.prisma.channelUser.findUnique({
            where: {
                channelId_userId: { channelId: chanId, userId: userId },
            },
        });
        return channelUser;
    }

}
