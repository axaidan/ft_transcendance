import { forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { Discussion, DiscussionMessage, User } from '@prisma/client';
import { DiscussionMessageService } from 'src/chat/discussion-message/discussion-message.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiscussionDto, GetDiscussionDto, GetDiscussionMessagesDto } from './dto';
import { ChatGateway } from '../chat.gateway';
import { DiscussionDto } from './dto/discussion.dto';

export type DiscussionWithUsers = {
    id: number
    user1Id: number
    user2Id: number
    user1: User
    user2: User
}

@Injectable()
export class DiscussionService {

    constructor(
        private prisma: PrismaService,
        private discMsgService: DiscussionMessageService,
        @Inject(forwardRef(() => ChatGateway))
        private chatGateway: ChatGateway,
    ) {}

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
            // console.log('getMessagesByUserId() - DISCUSSION NOT FOUND');
            const createDto: CreateDiscussionDto = {
                user1Id: user1Id,
                user2Id: user2Id,
            }
            discussion = await this.create(createDto);
            console.log('getMessagesByUserId() - DISCUSSION CREATED');
            // JOIN user1Id AND user2Id TO NEW ROOM
            this.chatGateway.joinDiscRoom(user1Id, discussion.id);
            this.chatGateway.joinDiscRoom(user2Id, discussion.id);
            // EMIT newDiscToClient TO ROOM
            const dto: DiscussionDto = {
                id: discussion.id,
                user1Id: discussion.user1Id,
                user2Id: discussion.user2Id,
                username1: discussion.user1.username,
                username2: discussion.user2.username,
            }
            this.chatGateway.newDisc(discussion.id, dto);
            messages = [];
        }
        else {
            // console.log('getMessagesByUserId() - DISCUSSION FOUND');
            messages = await this.discMsgService.getMessagesByDiscId(discussion.id);
        }
        const dto: GetDiscussionMessagesDto = {
            discId: discussion.id,
            messages: messages,
        };
        // console.log('getMessagesByUserId() - RETURNING:');
        console.log(dto);
        return dto;
    }
}