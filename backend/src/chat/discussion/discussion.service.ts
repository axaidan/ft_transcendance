import { ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Discussion, DiscussionMessage } from '@prisma/client';
import { DiscussionMessageService } from 'src/chat/discussion-message/discussion-message.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiscussionDto, DiscussionDto } from './dto';
import { DiscussionMessageDto } from '../discussion-message/dto';
import { DiscussionWithUsers } from './types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class DiscussionService {

    constructor(
        private prisma: PrismaService,
        private discMsgService: DiscussionMessageService,
    ) { }

    //  POST /discussion/:user2Id
    //  RETURNS NEW DISCUSSION WITH messages: []
    async create(dto: CreateDiscussionDto):
        Promise<DiscussionWithUsers> {
        try {
            const discussion = await this.prisma.discussion.create({
                data: {
                    user1Id: dto.user1Id,
                    user2Id: dto.user2Id,
                },
                include: {
                    user1: true,
                    user2: true,
                    messages: true,
                },
            });
            return discussion;
        } catch(e) {
            if (e instanceof PrismaClientKnownRequestError) {
                if (e.code === 'P2002') {
                    throw new ForbiddenException('Discussion already exists');
                }
            }
        }
    }

    //  GET /discussion/:id
    //  RETURNS A Discussion FOR GIVEN :id
    async findOneById(currentUserId: number, discId: number) :
    Promise<Discussion>
    {
        const discussion = await this.prisma.discussion.findUnique({
            where: {
                id: discId,
            },
            include: {
                user1: true,
                user2: true,
                messages: true,
            }
        });
        if (currentUserId !== discussion.user1Id && currentUserId !== discussion.user2Id) {
            throw new ForbiddenException('You are not a member of this discussion');
        }
        return discussion;
    }

    //  GET /discussion/user/:id
    //  RETURNS A Discussion FOR 2 GIVEN USER IDs
    async findOneByUserIds(currentUserId: number, user2Id: number) :
    Promise<Discussion>
    {
        const discussion = await this.prisma.discussion.findFirst({
            where: {
                OR: [
                    {user1Id: currentUserId, user2Id: user2Id},
                    {user1Id: user2Id, user2Id: currentUserId},
                ]
            },
            include: {
                user1: true,
                user2: true,
                messages: true,
            },
        });
        return discussion;
    }

    //  GET /discussion
    //  RETURNS ALL DISCUSSIONS OF GIVEN USER
    async getDiscussions(currentUserId: number):
        Promise<Discussion[]> {
        const discussions: Discussion[] = await this.prisma.discussion.findMany({
            where: {
                OR: [{ user1Id: currentUserId }, { user2Id: currentUserId }]
            },
            include: {
                user1: true,
                user2: true,
            },
        });
        return discussions;
    }

    async getDiscussionsIds(currentUserId: number):
        Promise<Discussion[]> {
        const discussions: Discussion[] = await this.prisma.discussion.findMany({
            where: {
                OR: [{ user1Id: currentUserId }, { user2Id: currentUserId }]
            },
        });
        return discussions;
    }

    async createDiscMsg(dto: DiscussionMessageDto):
        Promise<DiscussionMessage> {
        return await this.discMsgService.create(dto);
    }

    async messagesCount(discId: number):
        Promise<number> {
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