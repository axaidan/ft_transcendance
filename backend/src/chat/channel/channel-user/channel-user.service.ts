import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ChannelUser } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { find, NotFoundError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelUserRoleDto } from './dto';
import { CreateChannelUserDto } from './dto/create-channel-user.dto';
import { EChannelRoles, EChannelStatus } from './types';

@Injectable()
export class ChannelUserService {
    constructor (
        private prisma: PrismaService,
    ) {}

    async create(dto: CreateChannelUserDto) :
    Promise<ChannelUser>
    {
        try {
            const channelUser: ChannelUser = await this.prisma.channelUser.create({
                data: {
                    userId: dto.userId,
                    channelId: dto.channelId,
                    // status: dto.status,
                    role: dto.role,
                },
            });
            return channelUser;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new ForbiddenException(`ChannelUser (userId: ${dto.userId}, channelId: ${dto.channelId}) already exists.`);
                }
            }
        }
    }

    async delete(channelUser: ChannelUser): Promise<void> {
        await this.prisma.channelUser.delete({
            where: {
                channelId_userId: {
                    channelId: channelUser.channelId,
                    userId: channelUser.userId
                },
            },
        });
    }

    async getAllNonBannedChannelUsers(userId: number):
    Promise<ChannelUser[]>
    {
        const channelUsers : ChannelUser[] = await this.prisma.channelUser.findMany({
            where: {
                userId: userId,
                // status: { not: EChannelStatus.BANNED },
            },
        });
        return channelUsers;
    }

    async editRole(channelUser: ChannelUser, role: number)
    : Promise<ChannelUser>
    {
        channelUser = await this.prisma.channelUser.update({
            where: { channelId_userId: { channelId: channelUser.channelId, userId: channelUser.userId } },
            data: { role: role },
        });
        return channelUser;
    }

    async editStatus(channelUser: ChannelUser, status: number, statusTime: Date)
    : Promise<ChannelUser>
    {
        channelUser = await this.prisma.channelUser.update({
            where: { channelId_userId: { channelId: channelUser.channelId, userId: channelUser.userId } },
            data: {
                // status: status,
                // statusTime: statusTime
            },
        });
        return channelUser;
    }

    async findOne(userId: number, chanId: number) {
        const channelUser: ChannelUser = await this.prisma.channelUser.findUnique({
            where: { channelId_userId: { channelId: chanId, userId: userId } },
        });
        return channelUser;
    }

}
