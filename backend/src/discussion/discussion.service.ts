import { HttpException, Injectable } from '@nestjs/common';
import { Discussion } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiscussionDto } from './dto';


@Injectable()
export class DiscussionService {
    constructor(
        private prisma: PrismaService
    ) {}

    // POST /discussion/create
    async create(currentUserId: number, dto: CreateDiscussionDto) : Promise<Discussion> {
        if (await this.exists(currentUserId, dto.user2Id) === true)
            throw new HttpException('Discussion already exists', 400); 
        const discussion = await this.prisma.discussion.create({
            data: {
                user1Id: currentUserId,
                user2Id: dto.user2Id,
            }
        });
        return discussion;
    }

    // GET /discussion
    async getDiscussions(currentUserId: number) : Promise<Discussion[]> {
        const discussions: Discussion[] = await this.prisma.discussion.findMany({
            where: {
                OR: [ { user1Id: currentUserId }, { user2Id: currentUserId } ]
            },
            include: {
                user1: { select: { username: true, /*avatar: true,*/ } },
                user2: { select: { username: true, /*avatar: true,*/ } }
            }
        }); 
        return discussions;
    }

    async exists(user1Id: number, user2Id: number) : Promise<boolean> {
        const search: Discussion[] = await this.prisma.discussion.findMany({
            where: { OR: [
                    { user1Id: user1Id, user2Id: user2Id },
                    { user1Id: user2Id, user2Id: user1Id }
                ]}
        });
        if (search.length === 0)
            return (false);
        return (true);
    }
}
