import { Discussion, DiscussionMessage } from '@prisma/client';
import { DiscussionMessageService } from 'src/discussion-message/discussion-message.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiscussionDto } from './dto';
export declare class DiscussionService {
    private prisma;
    private discMsg;
    constructor(prisma: PrismaService, discMsg: DiscussionMessageService);
    create(currentUserId: number, dto: DiscussionDto): Promise<Discussion>;
    getDiscussions(currentUserId: number): Promise<Discussion[]>;
    getMessagesbyDiscId(discussionId: number): Promise<DiscussionMessage[]>;
    findIdByUserId(currentUserId: number, user2Id: number): Promise<number>;
    exists(user1Id: number, user2Id: number): Promise<boolean>;
}
