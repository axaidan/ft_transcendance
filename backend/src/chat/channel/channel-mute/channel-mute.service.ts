import { Injectable } from '@nestjs/common';
import { ChannelMute } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelMuteDto, CreateChannelMuteDto, EditChannelMuteDto } from './dto';

@Injectable()
export class ChannelMuteService {

    constructor(
        private prisma : PrismaService,
    ) {}

    async findOne(userId: number, chanId: number)
    : Promise<ChannelMute>
    {
        const channelMute = await this.prisma.channelMute.findUnique({
            where: { channelId_userId: { channelId: chanId, userId: userId } },
        })
        return channelMute;
    }

    async create(dto: CreateChannelMuteDto)
    : Promise<ChannelMute>
    {
        const channelMute = await this.prisma.channelMute.create({
            data: {
                channelId: dto.chanId,
                userId: dto.userId,
                muteExpires: dto.expires,
            }
        });
        return channelMute;
    }

    async delete(dto: ChannelMuteDto)
    : Promise<void>
    {
        await this.prisma.channelMute.delete({
            where: { channelId_userId: { channelId: dto.chanId, userId: dto.userId } },
        });
    }

    async edit(dto: EditChannelMuteDto)
    : Promise<ChannelMute>
    {
        const channelMute = await this.prisma.channelMute.update({
            where: { channelId_userId : { channelId: dto.chanId, userId: dto.userId } },
            data: { muteExpires: dto.expires },
        });
        return channelMute;
    }





}
