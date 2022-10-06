import { Injectable } from '@nestjs/common';
import { Discussion } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiscussionDto } from './dto';


@Injectable()
export class DiscussionService {
    constructor(
        private prisma: PrismaService
    ) {}

    async create(userId: number, dto: CreateDiscussionDto) : Promise<Discussion>{
        const discussion = await this.prisma.discussion.create({
            data: {
                user1Id: userId,
                user2Id: dto.user2Id,
            }
        });
        return discussion;
    }
}
