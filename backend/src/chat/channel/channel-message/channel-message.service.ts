import { Injectable } from '@nestjs/common';
import { ChannelMessage } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChannelMessageService {

    constructor(
        private prisma: PrismaService,
    ) {}

    async create(currentUserId: number,
        chanId: number,
        text: string,
        )
    : Promise<ChannelMessage>
    {
        const channelMessage = await this.prisma.channelMessage.create({
            data: {
                userId: currentUserId,
                chanId: chanId,
                text: text,
            },
        });

        /// J'AI BESOIN DU user.username


        const messageMax = await this.prisma.channelMessage.findFirst({
            where: { id: channelMessage.id },
            include: {
                user: true,
            }
        })


        return messageMax;
    }

}