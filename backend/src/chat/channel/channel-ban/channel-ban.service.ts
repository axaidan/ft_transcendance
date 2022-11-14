import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ChannelBan } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
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
            where: { chanId_userId: { chanId: chanId, userId: userId } },
            include: { user : { select: { username : true } } },
        })
        return channelBan;
    }

    async create(dto: ChannelBanDto)
    : Promise<ChannelBan>
    {
        try {
            const channelBan = await this.prisma.channelBan.create({
                data: {
                    chanId: dto.chanId,
                    userId: dto.userId,
                }
            });
            return channelBan;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new ForbiddenException('channelBan already exists');
                }
            }
        }
    }

    async delete(dto: ChannelBanDto)
    : Promise<ChannelBan>
    {
        try {
            const channelBan = await this.prisma.channelBan.delete({
                where: { chanId_userId: { chanId: dto.chanId, userId: dto.userId } },
            });
            return channelBan;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError) {
                throw new NotFoundException('channelMute not found');
            }
        }
    }

}