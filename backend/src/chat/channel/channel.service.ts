import { ForbiddenException, Injectable } from '@nestjs/common';
import { Channel, ChannelUser, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelUserService } from './channel-user/channel-user.service';
import { EChannelRoles, EChannelStatus } from './channel-user/types';
import { CreateChannelDto } from './dto/create-channel.dto';

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
                        }
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
        // const channelArr: Channel[] = await this.prisma.channel.findMany({
        //     where: {
        //         channelUsers: {
        //             every: { userId: userId }
        //         },
        //     },
        //     include : {
        //         channelUsers: {
                    // where: {
                    //     userId: userId,
                    // }
        //         }
        //     }
        // });
        const channelArr: Channel[] = await this.prisma.channel.findMany({
            where: {
                channelUsers: {
                    some: { userId: userId }
                },
            },
            include: {
                channelUsers: true,
                // channelMessages: true,
            },
        });
        for (const channel of channelArr) {
            const channelUser = await this.channelUserService.findOne(userId, channel.id);
            channel['userStatus'] = channelUser.status;
            channel['userRole'] = channelUser.role;
            channel['joined'] = true;
        }
        return channelArr;
    }

}
