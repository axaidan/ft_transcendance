import { Injectable } from '@nestjs/common';
import { Discussion, Channel, ChannelUser, ChannelMute, ChannelBan } from '@prisma/client';
import { ChannelBanDto } from './channel/channel-ban/dto';
import { ChannelMuteDto, CreateChannelMuteDto } from './channel/channel-mute/dto';
import { ChannelUserRoleDto, ChannelUserStatusDto } from './channel/channel-user/dto';
import { ChannelService } from './channel/channel.service';
import { ChannelPasswordDto, CreateChannelDto, EditChannelDto } from './channel/dto';
import { ChatGateway } from './chat.gateway';
import { DiscussionService } from './discussion/discussion.service';
import { CreateDiscussionDto, DiscussionDto } from './discussion/dto';
import { DiscussionWithUsers } from './discussion/types';

@Injectable()
export class ChatService {
    constructor(
        private chatGateway: ChatGateway,
        private discService: DiscussionService,
        private channelService: ChannelService,
    ) {}

    //////////////////////////
    //  DISCUSSION METHODS  //
    //////////////////////////

    //  GET /discussion
    //  RETURNS ALL DISCUSSIONS OF GIVEN USER
    async getDiscussions(currentUserId: number) :
    Promise<Discussion[]>
    {
        const discussions: Discussion[] = await this.discService.getDiscussions(currentUserId);
        return discussions;
    }

    //  GET /discussion/:id
    //  RETURNS A Discussion FOR GIVEN :id
    async getDiscussionById(currentUserId: number, discId: number) :
    Promise<Discussion>
    {
        const discussion = await this.discService.findOneById(currentUserId, discId);
        return discussion;
    }

    //  GET /discussion/user/:id
    //  RETURNS A Discussion W/ A GIVEN user2Id
    async getDiscussionByUserIds(currentUserId: number, user2Id: number) :
    Promise<Discussion>
    {
        const discussion = await this.discService.findOneByUserIds(currentUserId, user2Id);
        return discussion;
    }

    //  POST /discussion
    async createDiscussion(
        currentUserId: number,
        user2Id: number,
    ) :
    Promise<DiscussionWithUsers>
    {
        const dto: CreateDiscussionDto = {
            user1Id: currentUserId,
            user2Id: user2Id,
        };
        const discussion: DiscussionWithUsers = await this.discService.create(dto);

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

    //////////////////////
    //  CHANNEL METHODS //
    //////////////////////

    //  GET /channel/all
    async getAllPublicChannels(currentUserId: number) : 
    Promise<Channel[]>
    {
        const channels: Channel[] = await this.channelService.allPublic(currentUserId);
        return channels;
    }

    //  GET /channel
    async getAllChannelsForUser(userId: number) :
    Promise<Channel[]>
    {
        const channels: Channel[] = await this.channelService.allForUser(userId);
        return channels;
    }

    //  GET /channel/:chanId
    async getChannelWusersWmessages(currentUserId: number, chanId: number)
    : Promise<Channel>
    {
        const channel = await this.channelService.getWusersWMessages(currentUserId, chanId);
        return channel;
    }

    //  POST /channel
    async createChannel(
        currentUserId: number,
        dto: CreateChannelDto
    ) :
    Promise<Channel>
    {
        const channel: Channel = await this.channelService.create(currentUserId, dto);
        this.chatGateway.joinChannelRoom(currentUserId, channel.id);
        // event newChan
        return channel;
    }

    //  POST /channel/join + ChannelDto
    async joinChannel(
        currentUserId: number,
        chanId: number,
        dto: ChannelPasswordDto,
    ) : 
    Promise<Channel>
    {
        const channel: Channel = await this.channelService.join(currentUserId, chanId, dto);
        // event userJoined
        return channel;
    }

    //  POST /channel/join + ChannelDto
    async leaveChannel(
        currentUserId: number,
        chanId: number,
    ) : 
    Promise<Channel>
    {
        const channel: Channel = await this.channelService.leave(currentUserId, chanId);
        // event userLeft
        // ?event newRole
        return channel;
    }

    //  PATCH /channel/:chanId
    async editChannel(currentUserId: number, chanId: number, dto: EditChannelDto)
    : Promise<Channel>
    {
        const channel = await this.channelService.edit(currentUserId, chanId, dto);
        // event channelEdited
        return channel;
    }

    async deleteChannel(chanId: number)
    : Promise<Channel>
    {
        const channel = this.channelService.delete(chanId);
        // event newChanDelete
        return channel;
    }

    //////////////////////////
    //  CHANNELUSER METHODS //
    //////////////////////////

    async editChannelUserRole(currentUserId: number, dto: ChannelUserRoleDto)
    : Promise<ChannelUser>
    {
        const channelUser = await this.channelService.editChannelUserRole(currentUserId, dto);
        // event newRole
        // ?event newRole
        return channelUser;
    }

    //  POST /channel/:chanId/user/:userId/invite
    async inviteUserToChannel(
        currentUserId: number,
        chanId: number,
        userId: number,
    )
    : Promise<ChannelUser>
    {
        const channelUser = await this.channelService.inviteUser(currentUserId, chanId, userId);
        // event newUser to room
        // event newChannel to user
        return channelUser;
    }

    ///////////////////
    //  BAN METHODS  //
    ///////////////////

    async banChannelUser(dto: ChannelBanDto)
    : Promise<ChannelBan>
    {
        const channelBan = await this.channelService.banChannelUser(dto);
        // event newBan
        return channelBan;
    }

    async unbanChannelUser(dto: ChannelBanDto) 
    : Promise<ChannelBan>
    {
        const channelBan = await this.channelService.unbanChannelUser(dto);
        // event newUnban
        return channelBan;
    }

    ////////////////////
    //  MUTE METHODS  //
    ////////////////////

    async muteChannelUser(dto: CreateChannelMuteDto)
    : Promise<ChannelMute>
    {
        const channelMute = await this.channelService.muteChannelUser(dto);
        // event newMute
        return channelMute;
    }

    async unmuteChannelUser(dto: ChannelMuteDto) 
    : Promise<ChannelMute>
    {
        const channelMute = await this.channelService.unmuteChannelUser(dto);
        // event newUnmute
        return channelMute;
    }

    async editMute(dto: CreateChannelMuteDto)
    : Promise<ChannelMute>
    {
        const channelMute = this.channelService.editMute(dto);
        // event newEditMute
        return channelMute;
    }

}
