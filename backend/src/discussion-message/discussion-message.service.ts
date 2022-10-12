import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiscussionMessageDto } from './dto';

@Injectable()
export class DiscussionMessageService {
    constructor(
        private prisma: PrismaService,
    ) {}

    create(dto: DiscussionMessageDto) {
        this.prisma.discussionMessage.create({
            data: {
              text: dto.text,
              userId: dto.userId,
              discussionId: dto.discId,
            },
        });
    }
    
}
