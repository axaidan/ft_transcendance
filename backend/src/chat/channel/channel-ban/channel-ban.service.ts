import { Injectable } from '@nestjs/common';
import { ChannelBan } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelBanDto } from './dto';

@Injectable()
export class ChannelBanService {

    constructor (
        private prisma: PrismaService,
    ) {}

    async findOne(userId: number, chanId: number)
    : Promise<ChannelBan>
    {
        const channelBan = await this.prisma.channelBan.findUnique({
            where: { channelId_userId: { channelId: chanId, userId: userId } },
        })
        return channelBan;
    }

    async create(dto: ChannelBanDto)
    : Promise<ChannelBan>
    {
        const channelBan = await this.prisma.channelBan.create({
            data: {
                channelId: dto.chanId,
                userId: dto.userId,
            }
        });
        return channelBan;
    }

    async delete(dto: ChannelBanDto)
    : Promise<void>
    {
        await this.prisma.channelBan.delete({
            where: { channelId_userId: { channelId: dto.chanId, userId: dto.userId } },
        });
    }

}