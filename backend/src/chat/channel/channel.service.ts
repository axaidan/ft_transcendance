import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Channel, ChannelUser, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelUserService } from './channel-user/channel-user.service';
import { CreateChannelUserDto } from './channel-user/dto/create-channel-user.dto';
import { EChannelRoles, EChannelStatus } from './channel-user/types';
import { ChannelDto } from './dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import * as argon from 'argon2';

@Injectable()
export class ChannelService {

    constructor(
        private prisma: PrismaService,
        private channelUserService: ChannelUserService,
    ) { }

    //  POST /channel
    //  CREATES A CHANNEL WITH name, private AND OPTIONAL hash
    async create(
        currentUserId: number,
        dto: CreateChannelDto
    ): Promise<Channel> {
        if (dto.protected === true && dto.private === true) {
            throw new BadRequestException('cannot be private and protected');
        }
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
                channel['userStatus'] = channelUser.status;
                channel['userRole'] = channelUser.role;
                channel['userJoined'] = true;
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
            channel['userStatus'] = channelUser.status;
            channel['userRole'] = channelUser.role;
            channel['userJoined'] = true;
            delete channel.hash;
        }
        return channelArr;
    }

    //  POST /channel/join + ChannelDto
    //  reject if channel is private
    //  check hash if channel protected
    //  check status expiration if channel already joined
    async join(currentUserId: number, channelDto: ChannelDto):
        Promise<Channel> {
        const channel: Channel = await this.findOne(channelDto.id);
        if (channel === null) {
            throw new NotFoundException(`channel ${channelDto.id} NOT FOUND`);
        }
        if (channel.protected === true) {
            const passwordMatches = await argon.verify(channel.hash, channelDto.hash);
            if (passwordMatches === false) {
                throw new ForbiddenException('incorrect password');
            }
        }
        let channelUser: ChannelUser =
            await this.channelUserService.findOne(currentUserId, channelDto.id);
        if (channelUser === null) {
            const createChannelUserDto: CreateChannelUserDto = {
                userId: currentUserId,
                channelId: channelDto.id,
                status: EChannelStatus.NORMAL,
                role: EChannelRoles.NORMAL,
            }
            channelUser = await this.channelUserService.create(createChannelUserDto);
        }
        channel['userStatus'] = channelUser.status;
        channel['userRole'] = channelUser.role;
        channel['userJoined'] = true;
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

}
