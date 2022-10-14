import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { Discussion, DiscussionMessage, User } from '@prisma/client';
import { DiscussionMessageService } from 'src/discussion-message/discussion-message.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiscussionDto, GetDiscussionDto, GetDiscussionMessagesDto } from './dto';
import { DiscussionGateway } from './discussion.gateway';
import { Socket } from 'socket.io';

export type DiscussionWithUsers = {
    id: number
    user1Id: number
    user2Id: number
    user1: User
    user2: User
}

@Injectable()
export class DiscussionService {

    //private websockets = new Map<number, string>();
    private websockets = new Map<number, Socket>();

    constructor(
        private prisma: PrismaService,
        private discMsgService: DiscussionMessageService,
        @Inject(forwardRef(() => DiscussionGateway))
        private discGateway: DiscussionGateway,
    ) {}

    get wsMap() {
        return this.websockets;
    }

    async create(dto: CreateDiscussionDto) : Promise<DiscussionWithUsers> {
        const discussion = await this.prisma.discussion.create({
            data: {
                user1Id: dto.user1Id,
                user2Id: dto.user2Id,
            },
            include: {
                user1: true,    //  CANNOT SELECT ??
                user2: true,    //  CANNOT SELECT ??
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
                user1: { select: { id: true, username: true, /*avatar: true,*/ } },
                user2: { select: { id: true, username: true, /*avatar: true,*/ } },
            }
        }); 
        return discussions;
    }

    //  RETURNS Discussion OF TWO GIVEN UserS
    async getDiscussionByUsersId(user1Id: number, user2Id: number) :
    Promise<DiscussionWithUsers>
    {
        const discussion = await this.prisma.discussion.findFirst({
            where: {
                OR: [ { user1Id: user1Id, user2Id: user2Id }
                    , { user1Id: user2Id, user2Id: user1Id } ]
            },
            include: {
                user1: true,
                user2: true,
            }
        });
        return discussion;
    }

    //  GET /discussion/:id
    //  RETURNS Discussion AND DiscussionMesssages FOR A GIVEN id
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

    //  GET /discussion/user/:id
    //  RETURNS Discussion AND DiscussionMesssages OF 2 Users 
    //  CREATES THE Discussion IF DOESN'T EXIST
    async getMessagesByUserId(user1Id: number, user2Id: number) : 
    Promise<GetDiscussionMessagesDto>
    {
        let discussion: DiscussionWithUsers;
        let messages: DiscussionMessage[];

        discussion = await this.getDiscussionByUsersId(user1Id, user2Id);
        if (!discussion) {
            const createDto: CreateDiscussionDto = {
                user1Id: user1Id,
                user2Id: user2Id,
            }
            discussion = await this.create(createDto);
            this.discGateway.joinDiscRoom(this.wsMap[user1Id], discussion.id, /*DBG*/user1Id);
            this.discGateway.newDisc(this.wsMap[user1Id], discussion, /*DBG*/user1Id)
            if (this.wsMap[user2Id]) {
                this.discGateway.joinDiscRoom(this.wsMap[user2Id], discussion.id, /*DBG*/user2Id);
                this.discGateway.newDisc(this.wsMap[user2Id], discussion, /*DBG*/user2Id)
            }
            messages = [];
        }
        else {
            messages = await this.discMsgService.getMessagesByDiscId(discussion.id);
        }
        const dto: GetDiscussionMessagesDto = {
            discId: discussion.id,
            messages: messages,
        };
        return dto;
    }
}