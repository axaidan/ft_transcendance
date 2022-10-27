import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Channel, ChannelUser, Prisma } from '@prisma/client';
import { channel } from 'diagnostics_channel';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelUserService } from './channel-user/channel-user.service';
import { CreateChanelUserDto } from './channel-user/dto/create-channel-user.dto';
import { EChannelRoles, EChannelStatus } from './channel-user/types';
import { ChannelDto } from './dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { ChanWusersWmsgs, ChanWusersWmsgsWstatus } from './types';

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
    ):
        Promise<Channel> {
        const hash = ((dto.protected === true && 'hash' in dto) ? dto.hash : null);
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
                    include: {
                        channelUsers: true,
                    }
                });
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
            include: {
                channelUsers: {
                    where: {
                        userId: userId,
                    }
                }
            }
        });
        return channels;
    }

    // GET /channel
    async allForUser(userId: number):
    Promise<Channel[]>
    {
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
        }
        return channelArr;
    }

    //  POST /channel/join + ChannelDto
    //  reject if channel is private
    //  check hash if channel protected
    //  check status expiration if channel already joined
    async join(currentUserId: number, channelDto: ChannelDto) :
    Promise<Channel>
    {
        const channel = await this.findOne(channelDto.id);
        if (channel === null) {
            throw new NotFoundException(`channel ${channelDto.id} NOT FOUND`);
        }
        let channelUser: ChannelUser = await this.channelUserService.findOne(currentUserId, channelDto.id);
        if (channelUser === null) {
            const createChannelUserDto: CreateChanelUserDto = {
                userId: currentUserId,
                channelId: channelDto.id,
                status: EChannelStatus.NORMAL,
                role: EChannelRoles.NORMAL,
            }
            channelUser = await this.channelUserService.create(createChannelUserDto);
        }
        return channel;
    }

    async findOne(channelId: number) :
    Promise<Channel>
    {
        const channel: Channel = await this.prisma.channel.findUnique({
            where: {
                id: channelId,
            },
            include : {
                channelUsers: true,
                // messages: true,
            }
        })
        return channel;
    }

}
