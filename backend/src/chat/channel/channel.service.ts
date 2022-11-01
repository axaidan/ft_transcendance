import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Channel, ChannelUser, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelUserService } from './channel-user/channel-user.service';
import { CreateChannelUserDto } from './channel-user/dto/create-channel-user.dto';
import { EChannelRoles, EChannelStatus } from './channel-user/types';
import { ChannelDto, UserPropetiesDto } from './dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import * as argon from 'argon2';
import { ChannelUserRoleDto, ChannelUserStatusDto } from './channel-user/dto';
import { channel } from 'diagnostics_channel';

@Injectable()
export class ChannelService {

    constructor(
        private prisma: PrismaService,
        private channelUserService: ChannelUserService,
    ) { }

    //  POST /channel
    async create(
        currentUserId: number,
        dto: CreateChannelDto
    ): Promise<Channel> {
        // if (dto.protected === true && dto.private === true) {
        //     throw new BadRequestException('cannot be private and protected');
        // }
        let hash: string;
        if (dto.protected === true) {
            if (('hash' in dto) === false) {
                throw new BadRequestException('need password to be protected');
            }
            hash = await argon.hash(dto.hash);
        } else {
            hash = null;
        }
        try {
            const channel: Channel = await this.prisma.channel.create({
                data: {
                    name: dto.name,
                    private: dto.private,
                    protected: dto.protected,
                    hash: hash,
                    channelUsers: {
                        create: [{
                            userId: currentUserId,
                            status: EChannelStatus.NORMAL,
                            role: EChannelRoles.OWNER,
                        }],
                    },
                },
            });
            channel['userStatus'] = EChannelStatus.NORMAL;
            channel['userRole'] = EChannelRoles.OWNER;
            channel['userJoined'] = true;
            delete channel.hash;
            return channel;
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw (new ForbiddenException('Channel name is already used.'))
                }
            }
        }
    }

    //  GET /channel/all
    async allPublic(userId: number):
        Promise<Channel[]> {
        const channels: Channel[] = await this.prisma.channel.findMany({
            where: {
                private: false,
            },
        });
        for (const channel of channels) {
            const channelUser = await this.channelUserService.findOne(userId, channel.id);
            if (channelUser !== null) {
                this.setUserProperties(channel, {
                    status: channelUser.status,
                    role: channelUser.role,
                    joined: true, // false if BANNED, (true || false) if MUTED
                });
            } else {
                this.setUserProperties(channel, {
                    status: EChannelStatus.NORMAL,
                    role: EChannelRoles.NORMAL,
                    joined: false,
                });
            }
            delete channel.hash;
        }
        return channels;
    }

    // GET /channel
    async allForUser(userId: number):
        Promise<Channel[]> {
        const channelArr: Channel[] = await this.prisma.channel.findMany({
            where: {
                channelUsers: {
                    some: { userId: userId }
                },
            },
        });
        for (const channel of channelArr) {
            const channelUser = await this.channelUserService.findOne(userId, channel.id);
            this.setUserProperties(channel, {
                status: channelUser.status,
                role: channelUser.role,
                joined: true,   // false if banned
            });
            delete channel.hash;
        }
        return channelArr;
    }

    //  POST /channel/join + ChannelDto
    //  reject if channel is private (??? YES OR NO ?)
    async join(currentUserId: number, channelDto: ChannelDto):
        Promise<Channel> {
        const channel: Channel = await this.findOne(channelDto.id);
        if (channel === null) {
            throw new NotFoundException(`channel ${channelDto.id} NOT FOUND`);
        }
        //  check hash if channel protected
        if (channel.protected === true) {
            if (('hash' in channelDto) === false) {
                throw new BadRequestException('need password');
            }
            const passwordMatches = await argon.verify(channel.hash, channelDto.hash);
            if (passwordMatches === false) {
                throw new ForbiddenException('incorrect password');
            }
        }
        let channelUser: ChannelUser =
            await this.channelUserService.findOne(currentUserId, channelDto.id);
        if (channelUser === null) {
            channelUser = await this.channelUserService.create({
                userId: currentUserId,
                channelId: channelDto.id,
                status: EChannelStatus.NORMAL,
                role: EChannelRoles.NORMAL,
            });
        }
        else {
            // CHECK statu AND status_time
            // CHECK ROLE, if Owner FIND NEW Owner
        }
        this.setUserProperties(channel, {
            status: channelUser.status,
            role: channelUser.role,
            joined: true
        });
        delete channel.hash;
        return channel;
    }

    // if (user is owner find another owner)
    // if (status is not noral, keep ChannelUser record in db)
    async leave(userId: number, dto: ChannelDto):
        Promise<Channel> {
        const channelUser: ChannelUser = await this.channelUserService.findOne(userId, dto.id);
        if (channelUser === null)
            throw new ForbiddenException('channel not joined');
        if (channelUser.status === EChannelStatus.NORMAL)
            await this.channelUserService.delete(channelUser);
        else {
            // DO NOT DELETE IF STATUS IS NOT NORMAL
        }
        const channel: Channel = await this.findOne(dto.id);
        this.setUserProperties(channel, {
            status: channelUser.status,
            role: channelUser.role,
            joined: false,
        });
        delete channel.hash;
        return channel;
    }

    async findOne(channelId: number):
        Promise<Channel> {
        const channel: Channel = await this.prisma.channel.findUnique({
            where: {
                id: channelId,
            },
            // include: {
            //     channelUsers: true,
            // }
        });
        return channel;
    }

    async editChannelUserRole(currentUserId: number, dto: ChannelUserRoleDto)
    : Promise<ChannelUser>
    {
        let currentChannelUser = await this.channelUserService.findOne(currentUserId, dto.chanId);
        let channelUser = await this.channelUserService.findOne(dto.userId, dto.chanId);
        if (currentChannelUser === null || channelUser === null)
            throw new NotFoundException('user not found in channel');
        if (dto.role === EChannelRoles.OWNER)
            currentChannelUser = await this.channelUserService.editRole(currentChannelUser, EChannelRoles.ADMIN);
        else
            channelUser = await this.channelUserService.editRole(channelUser, dto.role);
        return channelUser;
    }

    async editChannelUserStatus(currentUserId: number, dto: ChannelUserStatusDto)
    : Promise<ChannelUser>
    {
        const currentChannelUser = await this.channelUserService.findOne(currentUserId, dto.chanId);
        let channelUser = await this.channelUserService.findOne(dto.userId, dto.chanId);
        if (currentChannelUser === null || channelUser === null)
            throw new NotFoundException('user not found in channel');
        channelUser = await this.channelUserService.editStatus(channelUser, dto.status, new Date());
        return channelUser;
    }

    setUserProperties(channel: Channel, dto: UserPropetiesDto) {
        channel['userStatus'] = dto.status;
        channel['userRole'] = dto.role;
        channel['userJoined'] = dto.joined;
        return channel;
    }

}
