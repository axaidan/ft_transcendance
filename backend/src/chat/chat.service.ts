import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Discussion, Channel, ChannelUser, ChannelMute, ChannelBan, User } from '@prisma/client';
import { UserService } from 'src/users/users.service';
import { ChannelBanDto } from './channel/channel-ban/dto';
import { ChannelMuteService } from './channel/channel-mute/channel-mute.service';
import { ChannelUserService } from './channel/channel-user/channel-user.service';
import { ChannelUserRoleDto } from './channel/channel-user/dto';
import { EChannelRoles } from './channel/channel-user/types';
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
        private channelUserService: ChannelUserService,
        private channelMuteService: ChannelMuteService,
        private userService: UserService,
    ) {}

    private logger: Logger = new Logger('ChatService');

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
        this.chatGateway.joinChannelRoom(currentUserId, channel.id);
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
        const channelUser = await this.channelUserService.findOne(currentUserId, channel.id);
        const channelMute = await this.channelMuteService.findOne(currentUserId, channel.id);
        channelUser[`mute`] = channelMute;
        this.chatGateway.joinChannelRoom(currentUserId, channel.id);
        this.chatGateway.userJoinedChannel(channelUser);
        return channel;
    }

    async leaveChannel(
        currentUserId: number,
        chanId: number,
    )
    : Promise<Channel>
    {
        const channel: Channel = await this.channelService.findOne(chanId);
        const channelUser: ChannelUser = await this.channelUserService.findOne(currentUserId, chanId);
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
        let currentChannelUser = await this.channelUserService.findOne(currentUserId, dto.chanId);
        let channelUser = await this.channelUserService.findOne(dto.userId, dto.chanId);

        if (dto.role !== EChannelRoles.OWNER && channelUser === currentChannelUser) {
            const channel = await this.channelService.findOne(dto.chanId);
            const newOwner = await this.channelService.passOwnership(currentChannelUser, channel);
            this.chatGateway.channelUserRoleEdited(newOwner);
        }
        else if (dto.role === EChannelRoles.OWNER) {
            currentChannelUser = await this.channelUserService.editRole(currentChannelUser, EChannelRoles.ADMIN);
            this.chatGateway.channelUserRoleEdited(currentChannelUser);
        }

        channelUser = await this.channelUserService.editRole(channelUser, dto.role);
        this.chatGateway.channelUserRoleEdited(channelUser);
        return channelUser;
    }

    async inviteUserToChannel(
        currentUserId: number,
        chanId: number,
        userId: number,
    )
    : Promise<ChannelUser>
    {
        const channelUser = await this.channelService.inviteUser(currentUserId, chanId, userId);
        const channelMute = await this.channelMuteService.findOne(userId, chanId);
        channelUser[`mute`] = channelMute;
        this.chatGateway.joinChannelRoom(channelUser.userId, channelUser.channelId);
        this.chatGateway.userJoinedChannel(channelUser);
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

    async muteChannelUser(userId: number, chanId: number)
    : Promise<ChannelMute>
    {
        const channelUser = await this.channelUserService.findOne(userId, chanId);
        // CHECK IF MUTED USER EXISTS IN CHANNEL
        // if (channelUser === null)
        //     throw new NotFoundException('user not found in channel');
        // CHECK IF MUTED USER THE OWNER OR ANOTHER ADMIN
        if (channelUser.role !== EChannelRoles.NORMAL)
            throw new ForbiddenException('cannot mute an admin or owner');
        const channelMute = await this.channelMuteService.create(userId, chanId);
        this.chatGateway.channelUserMuted(channelMute);
        return channelMute;
    }

    async unmuteChannelUser(userId: number, chanId: number) 
    : Promise<ChannelMute>
    {
        const channelMute = await this.channelMuteService.delete(userId, chanId);
        this.chatGateway.channelUserUnmuted(channelMute);
        return channelMute;
    }

    async editMute(userId: number, chanId: number)
    : Promise<ChannelMute>
    {
        const channelMute = this.channelMuteService.edit(userId, chanId);
        // event newEditMute
        return channelMute;
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    async muteExpirationCheck() {
        // this.logger.log('running muteExpirationCheck');
        const expiredChannelMutes: ChannelMute[] = await this.channelMuteService.allExpired();
        for (const channelMute of expiredChannelMutes) {
            await this.channelMuteService.delete(channelMute.userId, channelMute.channelId);
            this.logger.log(`channelMute expired detected : userId: \t${channelMute.userId}\tchannelId: ${channelMute.channelId}`);
            this.chatGateway.channelUserUnmuted(channelMute);
        }
    };

}
