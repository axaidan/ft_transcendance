import { ForbiddenException, Injectable } from '@nestjs/common';
import { Channel, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { domainToASCII } from 'url';
import { CreateChannelDto } from './dto/create-channel.dto';

@Injectable()
export class ChannelService {

    constructor(
        private prisma: PrismaService,
    ) { }

    //  POST /channel
    async create(dto: CreateChannelDto) :
    Promise<Channel>
    {
        let channel: Channel;
        try {
            if ('hash' in dto) {
                channel = await this.prisma.channel.create({
                    data: {
                        name: dto.name,
                        private: dto.private,
                        hash: dto.hash,
                    }
                });
            } else {
                channel = await this.prisma.channel.create({
                    data: {
                        name: dto.name,
                        private: dto.private,
                    }
                });
            }
            return channel;
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw (new ForbiddenException('Channel name is already used.'))
                }
            }
        }
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

    //  GET /channel/all
    async getAllChannels() :
    Promise<Channel[]>
    {
        const channels: Channel[] = await this.prisma.channel.findMany();
        return channels;
    }
}
