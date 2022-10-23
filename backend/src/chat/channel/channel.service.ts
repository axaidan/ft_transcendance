import { ForbiddenException, Injectable } from '@nestjs/common';
import { Channel, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';

@Injectable()
export class ChannelService {

    constructor(
        private prisma: PrismaService,
    ) { }

    //  POST /channel
    //  CREATES A CHANNEL WITH name, private AND OPTIONAL hash
    async create(
        currentUserId: number,
        dto: CreateChannelDto
    ):
        Promise<Channel> {
        const hash = (dto.protected === true ? dto.hash : null);
        try {
            const channel: Channel = await this.prisma.channel.create({
                    data: {
                        name: dto.name,
                        private: dto.private,
                        protected: dto.protected,
                        hash: hash,
                    },
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
    async allPublic():
        Promise<Channel[]> {
        const channels: Channel[] = await this.prisma.channel.findMany({
            where: {
                private: false,
            },
        });
        return channels;
    }

    // async getChannelsByUserId(currentUserId: number) :
    // Promise<Channel[]>
    // {
    //     const channelArr: Channel[] = [];
    //     const channelsUsers : ChannelUser[] = await this.prisma.channelUser.findMany({
    //         where: {
    //             userId: currentUserId,
    //         },
    //         include: {
    //             channel: true,/*{
    //                 include: {
    //                     channelMessages: true,
    //                 },
    //             },*/
    //         },
    //     });
    //     for (const channelUser of channelUsers) {
    //         channelArr.push(channelUser.channel);
    //     }
    //     return channelArr;
    // }

}
