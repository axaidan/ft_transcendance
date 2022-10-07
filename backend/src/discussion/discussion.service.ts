import { HttpException, Injectable } from '@nestjs/common';
import { Discussion } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiscussionDto } from './dto';


@Injectable()
export class DiscussionService {
    constructor(
        private prisma: PrismaService
    ) {}

    async create(userId: number, dto: CreateDiscussionDto) : Promise<Discussion> {
        if (await this.exists(userId, dto.user2Id) === true)
            throw new HttpException('Discussion already exists', 400); 
        const discussion = await this.prisma.discussion.create({
            data: {
                user1Id: userId,
                user2Id: dto.user2Id,
            }
        });
        return discussion;
    }

    async exists(user1Id: number, user2Id: number) : Promise<boolean> {
        const search: Discussion[] = await this.prisma.discussion.findMany({
            where: { OR: [
                    { user1Id: user1Id, user2Id: user2Id },
                    { user1Id: user2Id, user2Id: user1Id }
                ]}
        });
        if (search.length === 0)
            return false;
        return (true);
    }
}
