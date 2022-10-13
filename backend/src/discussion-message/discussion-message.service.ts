import { Injectable } from '@nestjs/common';
import { DiscussionMessage } from '@prisma/client';
import { GetDiscussionDto } from 'src/discussion/dto/get-discussion.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiscussionMessageDto } from './dto';

@Injectable()
export class DiscussionMessageService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async create(dto: DiscussionMessageDto) {
        const message = await this.prisma.discussionMessage.create({
            data: {
              text: dto.text,
              userId: dto.userId,
              discussionId: dto.discId,
            },
        });
        return message;
    }

    async getMessagesByDiscId(discId: number) {
        const messages: DiscussionMessage[] = await this.prisma.discussionMessage.findMany({
            where: {
                discussionId: discId
            },
            include: {
                user: { select: { id: true, username: true } }
            },
        });
        return messages;
    }
    
}
