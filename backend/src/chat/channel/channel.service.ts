import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Channel, ChannelBan, ChannelMute, ChannelUser, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelUserService } from './channel-user/channel-user.service';
import { ChannelBanService } from './channel-ban/channel-ban.service';
import { ChannelMuteService } from './channel-mute/channel-mute.service';
import { EChannelRoles, EChannelStatus } from './channel-user/types';
import { EChannelTypes } from './types/channel-types.enum';
import { ChannelDto, EditChannelDto, UserPropetiesDto } from './dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import * as argon from 'argon2';
import { ChannelUserRoleDto } from './channel-user/dto';
import { ChannelMuteDto, CreateChannelMuteDto } from './channel-mute/dto';
import { ChannelBanDto } from './channel-ban/dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class ChannelService {

    constructor(
        private prisma: PrismaService,
        private channelUserService: ChannelUserService,
        private channelBanService: ChannelBanService,
        private channelMuteService: ChannelMuteService,
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
        if (dto.type === EChannelTypes.PROTECTED) {
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
                    type: dto.type,
                    hash: hash,
                    channelUsers: {
                        create: [{
                            userId: currentUserId,
                            role: EChannelRoles.OWNER,
                        }],
                    },
                },
            });
            this.setUserProperties(currentUserId, channel, {
                role: EChannelRoles.NORMAL,
                joined: true,
            });
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
                NOT: { type: EChannelTypes.PRIVATE },
            },
        });
        for (const channel of channels) {
            const channelUser = await this.channelUserService.findOne(userId, channel.id);
            if (channelUser !== null) {
                await this.setUserProperties(userId, channel, {
                    role: channelUser.role,
                    joined: true,
                });
            } else {
                await this.setUserProperties(userId, channel, {
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
            await this.setUserProperties(userId, channel, {
                role: channelUser.role,
                joined: true,
            });
            delete channel.hash;
        }
        return channelArr;
    }

    // GET /channel/:chanId
    async getWusersWMessages(currentUserId: number, chanId: number)
    : Promise<Channel>
    {
        const channelUser = await this.channelUserService.findOne(currentUserId, chanId);
        if (channelUser === null)
            throw new NotFoundException('you must have joined the Channel');
        const channelBan = await this.channelBanService.findOne(currentUserId, chanId);
        if (channelBan !== null)
            throw new ForbiddenException('you are banned from this channel');
        const channel = await this.prisma.channel.findUnique({
            where: { id: chanId },
            include: {
                channelUsers: true,
                channelBans: true,
                channelMutes: true,
                // messages: true,
            }
        });
        if (channel === null)
            throw new NotFoundException('channel not found');
        await this.setUserProperties(currentUserId, channel, {
            role: channelUser.role,
            joined: true,
        });
        return channel;
    }

    async delete(chanId: number)
    : Promise<Channel>
    {
        try {
            const channel = this.prisma.channel.delete({
                where: { id: chanId },
            });
            return channel;
        }
        catch(e) {
            if (e instanceof PrismaClientKnownRequestError) 
                throw new NotFoundException('channel not found');
        }
    }

    //  PATCH /channel/:chanId
    async edit(currentUserId: number, chanId : number, dto: EditChannelDto)
    : Promise<Channel>
    {
        let hash: string;

        try {
            if ('type' in dto && dto.type === EChannelTypes.PROTECTED) {
                hash = await argon.hash(dto.hash);
            }
            const channel = await this.prisma.channel.update({
                where: { id: chanId },
                data: {
                    name: (dto.name !== undefined ? dto.name : undefined),
                    type: (dto.type !== undefined ? dto.type : undefined),
                    hash: (dto.hash !== undefined ? hash : undefined),
                },
        });
        await this.setUserProperties(currentUserId, channel, {
            role: EChannelRoles.OWNER,
            joined: true,
        });
        delete channel.hash;
        return channel;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === 'P2002') 
                    throw new ForbiddenException('channel name already taken');
                else
                    throw new ConflictException('sth wrong in db');

            }
        }
    }

    //  POST /channel/join + ChannelDto
    //  reject if channel is private (??? YES OR NO ?)
    async join(currentUserId: number, channelDto: ChannelDto):
        Promise<Channel> {
        const channel: Channel = await this.findOne(channelDto.chanId);
        if (channel === null)
            throw new NotFoundException(`channel ${channelDto.chanId} NOT FOUND`);
        if (channel.type === EChannelTypes.PRIVATE)
            throw new ForbiddenException('cannot join a private channel');
        if (channel.type === EChannelTypes.PROTECTED) {
            //  check hash if channel protected
            if (('hash' in channelDto) === false) {
                throw new BadRequestException('need password');
            }
            const passwordMatches = await argon.verify(channel.hash, channelDto.hash);
            if (passwordMatches === false) {
                throw new ForbiddenException('incorrect password');
            }
        }
        // CHECK IF USER IS NOT BANNED
        const channelBan = await this.channelBanService.findOne(currentUserId, channelDto.chanId);
        if (channelBan !== null)
            throw new ForbiddenException('you are banned from this channel');
        // CHECK IF USER DOESN'T ALREADY EXIST
        let channelUser: ChannelUser =
            await this.channelUserService.findOne(currentUserId, channelDto.chanId);
        if (channelUser === null) {
            channelUser = await this.channelUserService.create({
                userId: currentUserId,
                channelId: channelDto.chanId,
                status: EChannelStatus.NORMAL,
                role: EChannelRoles.NORMAL,
            });
        } else {
            throw new ForbiddenException('channel already joined');
        }
        this.setUserProperties(currentUserId, channel, {
            role: channelUser.role,
            joined: true
        });
        delete channel.hash;
        return channel;
    }

    // if (user is owner find another owner)
    async leave(userId: number, dto: ChannelDto):
        Promise<Channel> {
        const channelUser: ChannelUser = await this.channelUserService.findOne(userId, dto.chanId);
        if (channelUser === null)
            throw new ForbiddenException('channel not joined');
        const channel: Channel = await this.findOne(dto.chanId);
        if (channelUser.role === EChannelRoles.OWNER) {
            const nextOwner = await this.passOwnership(channelUser, channel);
            if (nextOwner === null)
                await this.delete(dto.chanId);
        }
        await this.channelUserService.delete(channelUser);
        this.setUserProperties(userId, channel, {
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

    async passOwnership(currentOwner: ChannelUser, channel: Channel)
    : Promise<ChannelUser>
    {
        let nextOwner = await this.channelUserService.findNextOwner(channel);
        if (nextOwner === null)
            return null;
        currentOwner = await this.channelUserService.editRole(currentOwner, EChannelRoles.ADMIN);
        nextOwner = await this.channelUserService.editRole(nextOwner, EChannelRoles.OWNER);
        return nextOwner;
    }


    //////////////////
    //  BAN METHODS //
    //////////////////

    async banChannelUser(dto: ChannelBanDto)
    : Promise<ChannelBan>
    {
        const channelUser = await this.channelUserService.findOne(dto.userId, dto.chanId);
        // CHECK IF BANNED USER EXISTS IN CHANNEL
        if (channelUser === null)
            throw new NotFoundException('user not found in channel');
        // CHECK IF BANNED USER THE OWNER OR ANOTHER ADMIN
        if (channelUser.role !== EChannelRoles.NORMAL)
            throw new ForbiddenException('cannot ban an admin or owner');
        const channelMute = await this.channelBanService.create(dto);
        await this.leave(dto.userId, { chanId: dto.chanId });
        return channelMute;
    }

    async unbanChannelUser(dto: ChannelBanDto) 
    : Promise<ChannelBan>
    {
        const channelBan = await this.channelBanService.delete(dto);
        return channelBan;
    }

    ///////////////////
    //  MUTE METHODS //
    ///////////////////

    async muteChannelUser(dto: CreateChannelMuteDto)
    : Promise<ChannelMute>
    {
        const channelUser = await this.channelUserService.findOne(dto.userId, dto.chanId);
        // CHECK IF MUTED USER EXISTS IN CHANNEL
        if (channelUser === null)
            throw new NotFoundException('user not found in channel');
        // CHECK IF MUTED USER THE OWNER OR ANOTHER ADMIN
        if (channelUser.role !== EChannelRoles.NORMAL)
            throw new ForbiddenException('cannot mute an admin or owner');
        const channelMute = await this.channelMuteService.create(dto);
        
        return channelMute;
    }

    async unmuteChannelUser(dto: ChannelMuteDto) 
    : Promise<ChannelMute>
    {
        const channelMute = await this.channelMuteService.delete(dto);
        return channelMute;
    }

    async editMute(dto: CreateChannelMuteDto) 
    : Promise<ChannelMute>
    {
        const channelMute = await this.channelMuteService.edit(dto);
        return channelMute;
    }

    async setUserProperties(userId: number, channel: Channel, dto: UserPropetiesDto) {
        const channelMute = await this.channelMuteService.findOne(userId, channel.id);
        const channelBan = await this.channelBanService.findOne(userId, channel.id);
        if (channelBan !== null)
            channel['userStatus'] = EChannelStatus.BANNED;
        else if (channelMute !== null)
            channel['userStatus'] = EChannelStatus.MUTED;
        else
            channel['userStatus'] = EChannelStatus.NORMAL;
        channel['userRole'] = dto.role;
        channel['userJoined'] = dto.joined;
        channel['muteExpires'] = channelMute === null ? null : channelMute.muteExpires;
        return channel;
    }

}
