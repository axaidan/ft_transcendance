import { HttpException, Injectable } from '@nestjs/common';
import { Discussion, DiscussionMessage } from '@prisma/client';
import { DiscussionMessageService } from 'src/discussion-message/discussion-message.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiscussionDto, GetDiscussionDto, GetDiscussionMessagesDto } from './dto';


@Injectable()
export class DiscussionService {
    constructor(
        private prisma: PrismaService,
        private discMsgService: DiscussionMessageService
    ) {}

    async create(dto: CreateDiscussionDto) : Promise<Discussion> {
        const discussion = await this.prisma.discussion.create({
            data: {
                user1Id: dto.user1Id,
                user2Id: dto.user2Id,
            }
        });
        return discussion;
    }

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

    // async getDiscussionById(discId: number) :
    // Promise<Discussion>
    // {
    //     const discussion: Discussion = await this.prisma.discussion.findUnique({
    //         where: {
    //             id: discId,
    //         },
    //     });
    //     return discussion;
    // }

    async getDiscussionByUsersId(user1Id: number, user2Id: number) :
    Promise<Discussion>
    {
        const discussion = await this.prisma.discussion.findFirst({
            where: {
                OR: [ { user1Id: user1Id, user2Id: user2Id }
                    , { user1Id: user2Id, user2Id: user1Id } ]
            },
        });
        return discussion;
    }

    async getMessagesByDiscId(discussionId: number) :
    Promise<GetDiscussionMessagesDto>
    { 
        const messages: DiscussionMessage[] = await this.discMsgService.getMessagesByDiscId(discussionId);
        const dto : GetDiscussionMessagesDto = {
            discId: discussionId,
            messages: messages,
        };
        return dto;
    }

    async getMessagesByUserId(user1Id: number, user2Id: number) : 
    Promise<GetDiscussionMessagesDto>
    {
        let discussion: Discussion;
        let messages: DiscussionMessage[];

        discussion = await this.getDiscussionByUsersId(user1Id, user2Id);
        if (!discussion) {
            const dto: CreateDiscussionDto = {
                user1Id: user1Id,
                user2Id: user2Id,
            }
            discussion = await this.create(dto);
            // JOIN NEW ROOM
            // SEND NEW DISCUSSION EVENT
            messages = [];
        }
        else {
            messages = await this.discMsgService.getMessagesByDiscId(discussion.id);
        }
        const dto: GetDiscussionMessagesDto = {
            discId: discussion.id,
            messages: messages,
        }
        return dto;
    }
}
