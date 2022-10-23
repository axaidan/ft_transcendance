import { Injectable } from '@nestjs/common';
import { Discussion, Channel } from '@prisma/client';
import { ChannelService } from './channel/channel.service';
import { CreateChannelDto } from './channel/dto';
import { ChatGateway } from './chat.gateway';
import { DiscussionService } from './discussion/discussion.service';
import { CreateDiscussionDto, DiscussionDto } from './discussion/dto';
import { DiscussionWithUsersWithMessages } from './discussion/types/DiscussionWithUsersWithMessages';

@Injectable()
export class ChatService {
    constructor(
        private chatGateway: ChatGateway,
        private discService: DiscussionService,
        private channelService: ChannelService,
    ) {}

    //  GET /discussion
    //  RETURNS ALL DISCUSSIONS OF GIVEN USER
    async getDiscussions(currentUserId: number) :
    Promise<Discussion[]>
    {
        const discussions: Discussion[] = await this.discService.getDiscussions(currentUserId);
        return discussions;
    }


    //  POST /discussion
    async createDiscussion(
        currentUserId: number,
        user2Id: number,
    ) :
    Promise<DiscussionWithUsersWithMessages>
    {
        const dto: CreateDiscussionDto = {
            user1Id: currentUserId,
            user2Id: user2Id,
        };
        const discussion: DiscussionWithUsersWithMessages = await this.discService.create(dto);

        this.chatGateway.joinDiscRoom(discussion.user1Id, discussion.id);
        this.chatGateway.joinDiscRoom(discussion.user2Id, discussion.id);

        const newDiscDto: DiscussionDto = {
            user1Id: discussion.user1Id,
            user2Id: discussion.user2Id,
            username1: discussion.user1.username,
            username2: discussion.user2.username,
            id: discussion.id,
        };
        this.chatGateway.newDisc(newDiscDto);
        return discussion;
    }

    //  GET /channel/all
    async getAllChannels() : 
    Promise<Channel[]>
    {
        const channels: Channel[] = await this.channelService.all();
        return channels;
    }

    //  POST /channel
    async createChannel(
        currentUserId: number,
        dto: CreateChannelDto
    ) :
    Promise<Channel>
    {
        const channel: Channel = await this.channelService.create(currentUserId, dto);
        return channel;
    }






}
