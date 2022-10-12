import { DiscussionService } from './discussion.service';
import { DiscussionDto } from './dto';
export declare class DiscussionController {
    private discService;
    constructor(discService: DiscussionService);
    create(currentUserId: number, dto: DiscussionDto): Promise<import(".prisma/client").Discussion>;
    getMessagesByUserId(currentUserId: number, user2Id: number): Promise<import(".prisma/client").DiscussionMessage[]>;
    getDiscussions(currentUserId: number): Promise<import(".prisma/client").Discussion[]>;
}
