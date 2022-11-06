import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseEnumPipe, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { Discussion, Channel, ChannelUser, ChannelBan, ChannelMute } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { domainToASCII } from 'url';
import { CreateChannelMuteDto } from './channel/channel-mute/dto';
import { ChannelUserRoleDto } from './channel/channel-user/dto';
import { ChannelRoles } from './channel/decorators/roles.decorator';
import { ChannelPasswordDto, CreateChannelDto, EditChannelDto } from './channel/dto';
import { NotBannedGuard } from './channel/guards/not-banned.guard';
import { ChannelRolesGuard } from './channel/guards/roles.guard';
import { ChatService } from './chat.service';
import { CreateDiscussionBodyDto } from './discussion/dto';
import { DiscussionWithUsers } from './discussion/types';

@UseGuards(JwtGuard, ChannelRolesGuard)
@Controller()
export class ChatController {

    constructor(
        private chatService: ChatService,
    ) { }

    //////////////////////////
    //  DISCUSSION REQUESTS //
    //////////////////////////

    @Get('discussion')
    async getDiscussions(@GetUser('id') currentUserId: number):
        Promise<Discussion[]> {
        return await this.chatService.getDiscussions(currentUserId);
    }

    @Get('discussion/:id')
    async getDiscussionById(
        @GetUser('id') currentUserId: number,
        @Param('id', ParseIntPipe) discId: number,
    ):
        Promise<Discussion> {
        const discussion = await this.chatService.getDiscussionById(currentUserId, discId);
        return discussion;
    }

    @Get('discussion/user/:id')
    async getDiscussionByUserId(
        @GetUser('id') currentUserId: number,
        @Param('id', ParseIntPipe) user2Id: number,
    ):
        Promise<Discussion> {
        const discussion = await this.chatService.getDiscussionByUserIds(currentUserId, user2Id);
        return discussion;
    }

    //  POST /discussion
    @Post('discussion')
    async createDiscussion(
        @GetUser('id') currentUserId: number,
        @Body() body: CreateDiscussionBodyDto,
    ):
        Promise<DiscussionWithUsers> {
        return this.chatService.createDiscussion(currentUserId, body.user2Id);
    }

    //////////////////////////
    //  CHANNEL REQUESTS    //
    //////////////////////////

    // @Get('channels/all')
    @Get('channels/all')
    async getAllPublicChannels(@GetUser('id') currentUserId: number)
        : Promise<Channel[]> {
        const channels: Channel[] = await this.chatService.getAllPublicChannels(currentUserId);
        return channels;
    }

    // @Get('channels')
    @Get('channels')
    async getAllChannelsForUser(@GetUser('id') currentUserId: number)
        : Promise<Channel[]> {
        const channels: Channel[] = await this.chatService.getAllChannelsForUser(currentUserId);
        return channels;
    }

    @Post('channel')
    async createChannel(
        @GetUser('id') currentUserId: number,
        @Body() createChanDto: CreateChannelDto,
    ): Promise<Channel> {
        const channel: Channel = await this.chatService.createChannel(currentUserId, createChanDto);
        return channel;
    }

    @Get('channel/:chanId')
    @UseGuards(NotBannedGuard)
    async getChannelWusersWmessages(
        @GetUser('id') currentUserId: number,
        @Param('chanId', ParseIntPipe) chanId: number,
    )
        : Promise<Channel> {
        const channel = await this.chatService.getChannelWusersWmessages(currentUserId, chanId);
        return channel;
    }

    @Patch('channel/:chanId')
    @ChannelRoles('owner')
    async editChannel(
        @GetUser('id') currentUserId: number,
        @Param('chanId', ParseIntPipe) chanId: number,
        @Body() dto: EditChannelDto,
    )
        : Promise<Channel> {
        const channel = await this.chatService.editChannel(currentUserId, chanId, dto);
        return channel;
    }

    @Delete('channel/:chanId')
    @ChannelRoles('owner')
    async deleteChannel(
        @Param('chanId', ParseIntPipe) chanId: number,
    )
        : Promise<Channel> {
        const channel = await this.chatService.deleteChannel(chanId);
        return channel;
    }

    // @Post('channel/join')
    @Post('channel/:chanId/join')
    @UseGuards(NotBannedGuard)
    async joinChannel(
        @GetUser('id') currentUserId: number,
        @Param('chanId', ParseIntPipe) chanId: number,
        @Body() dto: ChannelPasswordDto,
    ): Promise<Channel> {
        const channel: Channel = await this.chatService.joinChannel(currentUserId, chanId, dto);
        return channel;
    }

    @HttpCode(200)
    @Post('channel/:chanId/leave')
    async leaveChannel(
        @GetUser('id') currentUserId: number,
        @Param('chanId', ParseIntPipe) chanId: number,
    ): Promise<Channel> {
        const channel: Channel = await this.chatService.leaveChannel(currentUserId, chanId);
        return channel;
    }

    //////////////////////////////
    //  CHANNELUSER REQUESTS    //
    //////////////////////////////

    // INVITE USER
    @Post('channel/:chanId/user/:userId')
    @ChannelRoles('admin')
    async inviteUserToChannel(
        @GetUser('id') currentUserId: number,
        @Param('chanId', ParseIntPipe) chanId: number,
        @Param('userId', ParseIntPipe) userId: number,
    )
        : Promise<ChannelUser> {
        const channelUser = await this.chatService.inviteUserToChannel(currentUserId, chanId, userId);
        return channelUser;
    }

    // EDIT ChannelUser'S role
    @Patch('channel/:chanId/user/:userId')
    @ChannelRoles('owner')
    async editChannelUserRole(
        @GetUser('id') currentUserId: number,
        @Param('chanId', ParseIntPipe) chanId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @Body() dto: ChannelUserRoleDto,
    )
        : Promise<ChannelUser> {
        const channelUser = await this.chatService.editChannelUserRole(currentUserId, {
            chanId: chanId,
            userId: userId,
            role: dto.role,
        });
        return channelUser;
    }

    ///////////////////
    //  BAN REQUESTS //
    ///////////////////

    @Post('channel/:chanId/user/:userId/ban')
    @ChannelRoles('admin')
    async ban(
        @Param('chanId', ParseIntPipe) chanId: number,
        @Param('userId', ParseIntPipe) userId: number,
        )
        : Promise<ChannelBan> {
        const channelBan = await this.chatService.banChannelUser({
            chanId: chanId,
            userId: userId,
        });
        return channelBan;
    }

    @Delete('channel/:chanId/user/:userId/ban')
    @ChannelRoles('admin')
    async unban(
        @Param('chanId', ParseIntPipe) chanId: number,
        @Param('userId', ParseIntPipe) userId: number,
    )
        : Promise<ChannelBan> {
        const channelBan = await this.chatService.unbanChannelUser({
            chanId: chanId,
            userId: userId,
        });
        return channelBan;
    }

    ////////////////////
    //  MUTE REQUESTS //
    ////////////////////

    @Post('channel/:chanId/user/:userId/mute')
    @ChannelRoles('admin')
    async mute(
        @Param('chanId', ParseIntPipe) chanId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @Body() dto: CreateChannelMuteDto,
    )
        : Promise<ChannelMute> {
        const channelMute = await this.chatService.muteChannelUser(dto);
        return channelMute;
    }

    @Delete('channel/:chanId/user/:userId/mute')
    @ChannelRoles('admin')
    async unmute(
        @Param('chanId', ParseIntPipe) chanId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @Body() dto: CreateChannelMuteDto
        )
        : Promise<ChannelMute> {
        const channelMute = await this.chatService.unmuteChannelUser(dto);
        return channelMute;
    }

    @Patch('channel/:chanId/user/:userId/mute')
    @ChannelRoles('admin')
    async editMute(
        @Param('chanId', ParseIntPipe) chanId: number,
        @Param('userId', ParseIntPipe) userId: number,
        @Body() dto: CreateChannelMuteDto
        )
        : Promise<ChannelMute> {
        const channelMute = await this.chatService.editMute(dto);
        return channelMute;
    }

}
