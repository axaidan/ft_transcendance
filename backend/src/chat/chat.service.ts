import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Discussion, Channel, ChannelUser, ChannelMute, ChannelBan, User } from '@prisma/client';
import { UserService } from 'src/users/users.service';
import { ChannelBanDto } from './channel/channel-ban/dto';
import { ChannelMuteDto, CreateChannelMuteDto } from './channel/channel-mute/dto';
import { ChannelUserService } from './channel/channel-user/channel-user.service';
import { ChannelUserRoleDto, ChannelUserStatusDto } from './channel/channel-user/dto';
import { EChannelRoles } from './channel/channel-user/types';
import { ChannelService } from './channel/channel.service';
import { ChannelPasswordDto, CreateChannelDto, EditChannelDto } from './channel/dto';
import { EChannelTypes } from './channel/types/channel-types.enum';
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
        private channelUserService: ChannelUserService,
        private userService: UserService,
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

    async getAllPublicChannels(currentUserId: number) : 
    Promise<Channel[]>
    {
        const channels: Channel[] = await this.channelService.allPublic(currentUserId);
        return channels;
    }

    async getAllChannelsForUser(userId: number) :
    Promise<Channel[]>
    {
        const channels: Channel[] = await this.channelService.allForUser(userId);
        return channels;
    }

    async getChannelWusersWmessages(currentUserId: number, chanId: number)
    : Promise<Channel>
    {
        const channel = await this.channelService.getWusersWMessages(currentUserId, chanId);
        return channel;
    }

    async createChannel(
        currentUserId: number,
        dto: CreateChannelDto
    )
    : Promise<Channel>
    {
        const channel: Channel = await this.channelService.create(currentUserId, dto);
        // this.chatGateway.joinChannelRoom(currentUserId, channel.id);
        return channel;
    }

    async joinChannel(
        currentUserId: number,
        chanId: number,
        dto: ChannelPasswordDto,
    )
    : Promise<Channel>
    {
        const channel: Channel = await this.channelService.join(currentUserId, chanId, dto);
        const user: User = await this.userService.getUser(currentUserId);
        this.chatGateway.joinChannelRoom(currentUserId, channel.id);
        this.chatGateway.userJoinedChannel(currentUserId, channel.id, user.username);
        return channel;
    }

    async leaveChannel(
        currentUserId: number,
        chanId: number,
    )
    : Promise<Channel>
    {
        const channel: Channel = await this.channelService.findOne(chanId);
        if (channel === null)
            throw new NotFoundException('channel not found');

        const channelUser: ChannelUser = await this.channelUserService.findOne(currentUserId, chanId);
        if (channelUser === null)
            throw new NotFoundException('channel not joined');

        if (channelUser.role === EChannelRoles.OWNER) {
            const nextOwner = await this.channelService.passOwnership(channelUser, channel);
            if (nextOwner === null) {
                const deletedChannel = await this.channelService.delete(chanId);
                this.chatGateway.channelDeleted(deletedChannel);
            }
            else
                this.chatGateway.channelUserRoleEdited(nextOwner);
        }

        await this.channelUserService.delete(channelUser.userId, channelUser.channelId);

        this.channelService.setUserProperties(currentUserId, channel, {
            role: channelUser.role,
            joined: false,
        });
        delete channel.hash;
        this.chatGateway.leaveChannelRoom(currentUserId, chanId);
        this.chatGateway.userLeftChannel(currentUserId, chanId);
        return channel;
    }

    async editChannel(currentUserId: number, chanId: number, dto: EditChannelDto)
    : Promise<Channel>
    {
        const originalChannel = await this.channelService.findOne(chanId);
        if (originalChannel === null) 
            throw new NotFoundException('channel not found');
        const editedChannel = await this.channelService.edit(currentUserId, chanId, dto);
        if (originalChannel.name !== editedChannel.name)
            this.chatGateway.channelNameEdited(editedChannel);
        if (originalChannel.type !== editedChannel.type)
            this.chatGateway.channelTypeEdited(editedChannel);
        return editedChannel;
    }

    async deleteChannel(chanId: number)
    : Promise<Channel>
    {
        const channel = await this.channelService.delete(chanId);
        this.chatGateway.channelDeleted(channel);
        return channel;
    }

    //////////////////////////
    //  CHANNELUSER METHODS //
    //////////////////////////

    async editChannelUserRole(currentUserId: number, dto: ChannelUserRoleDto)
    : Promise<ChannelUser>
    {
        const channelUser = await this.channelService.editChannelUserRole(currentUserId, dto);
        this.chatGateway.channelUserRoleEdited(channelUser);
        if (channelUser.role === EChannelRoles.OWNER) {
            const ancientOwner = await this.channelUserService.findOne(currentUserId, dto.chanId);
            this.chatGateway.channelUserRoleEdited(ancientOwner);
        }
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
        const user = await this.userService.getUser(userId);
        this.chatGateway.joinChannelRoom(channelUser.userId, channelUser.channelId);
        this.chatGateway.userJoinedChannel(channelUser.userId, channelUser.channelId, user.username);
        const channel = await this.channelService.findOne(channelUser.channelId);
        this.chatGateway.invitedToChannel(channelUser, channel);
        return channelUser;
    }

    ///////////////////
    //  BAN METHODS  //
    ///////////////////

    async banChannelUser(dto: ChannelBanDto)
    : Promise<ChannelBan>
    {
        const channelBan = await this.channelService.banChannelUser(dto);
        this.chatGateway.leaveChannelRoom(channelBan.userId, channelBan.channelId);
        this.chatGateway.channelUserBanned(channelBan);
        return channelBan;
    }

    async unbanChannelUser(dto: ChannelBanDto) 
    : Promise<ChannelBan>
    {
        const channelBan = await this.channelService.unbanChannelUser(dto);
        this.chatGateway.channelUserUnbanned(channelBan);
        return channelBan;
    }

    ////////////////////
    //  MUTE METHODS  //
    ////////////////////

    async muteChannelUser(dto: CreateChannelMuteDto)
    : Promise<ChannelMute>
    {
        const channelMute = await this.channelService.muteChannelUser(dto);
        this.chatGateway.channelUserMuted(channelMute);
        return channelMute;
    }

    async unmuteChannelUser(dto: ChannelMuteDto) 
    : Promise<ChannelMute>
    {
        const channelMute = await this.channelService.unmuteChannelUser(dto);
        this.chatGateway.channelUserUnmuted(channelMute);
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
