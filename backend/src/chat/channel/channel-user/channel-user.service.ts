import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Channel, ChannelUser } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelUserDto } from './dto/create-channel-user.dto';
import { EChannelRoles } from './types';

@Injectable()
export class ChannelUserService {
    constructor (
        private prisma: PrismaService,
    ) {}

    async create(dto: CreateChannelUserDto)
    : Promise<ChannelUser>
    {
        try {
            const channelUser: ChannelUser = await this.prisma.channelUser.create({
                data: {
                    userId: dto.userId,
                    chanId: dto.chanId,
                    // status: dto.status,
                    role: dto.role,
                },
            });
            return channelUser;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new ForbiddenException(`channel already joined`);
                }
            }
        }
    }

    async delete(userId: number, chanId: number)
    : Promise<void>
    {
        await this.prisma.channelUser.delete({
            where: { chanId_userId: { chanId: chanId, userId: userId } },
        });
    }

    async getAllJoinedChannelUsers(userId: number)
    : Promise<ChannelUser[]>
    {
        const channelUsers : ChannelUser[] = await this.prisma.channelUser.findMany({
            where: { userId: userId },
        });
        return channelUsers;
    }

    async editRole(channelUser: ChannelUser, role: number)
    : Promise<ChannelUser>
    {
        channelUser = await this.prisma.channelUser.update({
            where: { chanId_userId: { chanId: channelUser.chanId, userId: channelUser.userId } },
            data: { role: role },
        });
        return channelUser;
    }

    async findOne(userId: number, chanId: number)
    : Promise<ChannelUser>
    {
        const channelUser: ChannelUser = await this.prisma.channelUser.findUnique({
            where: { chanId_userId: { chanId: chanId, userId: userId } },
            include: { user : { select: { username: true } } },
        });
        return channelUser;
    }

    async findNextOwner(channel: Channel)
    : Promise<ChannelUser>
    {
        let nextOwner = await this.prisma.channelUser.findFirst({
            where: { chanId: channel.id, role: EChannelRoles.ADMIN },
            orderBy: { updatedAt: 'asc' },
        });
        if (nextOwner !== null)
            return nextOwner;
        nextOwner = await this.prisma.channelUser.findFirst({
            where: { chanId: channel.id },
            orderBy: { createdAt: 'asc' },
        });
        return nextOwner;
    }

}
