import { HttpException, Injectable } from '@nestjs/common';
import { Discussion, DiscussionMessage } from '@prisma/client';
import { DiscussionMessageService } from 'src/discussion-message/discussion-message.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiscussionDto } from './dto';


@Injectable()
export class DiscussionService {
    constructor(
        private prisma: PrismaService,
        private discMsg: DiscussionMessageService
    ) {}

    // POST /discussion/create
    // MAYBE USELESS
    async create(currentUserId: number, dto: DiscussionDto) : Promise<Discussion> {
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
                user1: { select: { id: true, username: true, /*avatar: true,*/ } },
                user2: { select: { id: true, username: true, /*avatar: true,*/ } }
            }
        }); 
        return discussions;
    }

    async getMessagesbyDiscId(discussionId: number) : Promise<DiscussionMessage[]> {
        const messages: DiscussionMessage[] = await this.prisma.discussionMessage.findMany({
            where: {
                discussionId: discussionId,
            },
            include: {
                user: { select: { id: true, username: true } }
            }
        });
        return messages;
    }
    
    async findIdByUserId(currentUserId: number, user2Id: number) /*: Promise<number> */ {
        const discussion = await this.prisma.discussion.findFirst({
            where: {
                OR: [
                    { user1Id: currentUserId, user2Id: user2Id },
                    { user1Id: user2Id, user2Id: currentUserId },
                ]
            }
        });
        if (discussion === null)
            return null;
        const discussionId = discussion.id;
        return discussionId;
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
