import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Discussion, DiscussionMessage } from '@prisma/client';
import { DiscussionMessageService } from 'src/chat/discussion-message/discussion-message.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiscussionDto, DiscussionDto } from './dto';
import { ChatGateway } from '../chat.gateway';
import { DiscussionMessageDto } from '../discussion-message/dto';
import { DiscussionWithUsersWithMessages } from './types/DiscussionWithUsersWithMessages';

@Injectable()
export class DiscussionService {

    constructor(
        private prisma: PrismaService,
        private discMsgService: DiscussionMessageService,
    ) {}

    //  POST /discussion/:user2Id
    //  RETURNS NEW DISCUSSION WITH messages: []
    async create(dto: CreateDiscussionDto) :
    Promise<DiscussionWithUsersWithMessages>
    {
        const discussion = await this.prisma.discussion.create({
            data: {
                user1Id: dto.user1Id,
                user2Id: dto.user2Id,
            },
            include: {
                user1: { select: { id: true, username: true } },
                user2: { select: { id: true, username: true } },
                messages: { select: { text: true, userId: true } }, 
            },
        });
        return discussion;
    }

    //  GET /discussion
    //  RETURNS ALL DISCUSSIONS OF GIVEN USER
    async getDiscussions(currentUserId: number) :
    Promise<Discussion[]>
    {
        const discussions: Discussion[] = await this.prisma.discussion.findMany({
            where: {
                OR: [ { user1Id: currentUserId }, { user2Id: currentUserId } ]
            },
            include: {
                user1: { select: { id: true, username: true, } },
                user2: { select: { id: true, username: true, } },
                messages: { select: { text: true, userId: true } },
            },
        }); 
        return discussions;
    }

    async getDiscussionsIds(currentUserId: number) :
    Promise<Discussion[]>
    {
        const discussions: Discussion[] = await this.prisma.discussion.findMany({
            where: {
                OR: [ { user1Id: currentUserId }, { user2Id: currentUserId } ]
            },
        }); 
        return discussions;
    }

    async createDiscMsg(dto: DiscussionMessageDto) :
    Promise<DiscussionMessage>
    {
        return await this.discMsgService.create(dto);
    }

    async messagesCount(discId: number) :
    Promise<number> 
    {
        const messagesCount = await this.prisma.discussion.findUnique({
            where: {
                id: discId,
            },
            include: {
                _count: {
                    select: { messages: true },
                },
            },
        });
        return messagesCount._count.messages;
    }
}