import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { Discussion, Channel, ChannelUser, ChannelBan, ChannelMute } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { domainToASCII } from 'url';
import { ChannelBanDto } from './channel/channel-ban/dto';
import { ChannelMuteDto, CreateChannelMuteDto } from './channel/channel-mute/dto';
import { ChannelUserRoleDto, ChannelUserStatusDto } from './channel/channel-user/dto';
import { Roles } from './channel/decorators/roles.decorator';
import { ForbiddenStatus } from './channel/decorators/status.decorator';
import { ChannelDto, CreateChannelDto } from './channel/dto';
import { RolesGuard } from './channel/guards/roles.guard';
import { ForbiddenStatusGuard } from './channel/guards/status.guard';
import { ChatService } from './chat.service';
import { CreateDiscussionBodyDto } from './discussion/dto';
import { DiscussionWithUsers } from './discussion/types';

@UseGuards(JwtGuard, RolesGuard)
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
    ) :
    Promise<Discussion>
    {
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

    @Get('channel/all')
    async getAllPublicChannels(@GetUser('id') currentUserId: number)
        : Promise<Channel[]> {
        const channels: Channel[] = await this.chatService.getAllPublicChannels(currentUserId);
        return channels;
    }

    @Get('channel')
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

    // @UseGuards(ForbiddenStatusGuard)
    @Post('channel/join')
    // @ForbiddenStatus('ban')
    async joinChannel(
        @GetUser('id') currentUserId: number,
        @Body() channelDto: ChannelDto,
    ): Promise<Channel> {
        const channel: Channel = await this.chatService.joinChannel(currentUserId, channelDto);
        return channel;
    }

    @HttpCode(200)
    @Post('channel/leave')
    async leaveChannel(
        @GetUser('id') currentUserId: number,
        @Body() channelDto: ChannelDto,
    ): Promise<Channel> {
        const channel: Channel = await this.chatService.leaveChannel(currentUserId, channelDto);
        return channel;
    }

    // //   UPDATE Channel/:id (name)
    // //   ONLY IF USER IS OWNER
    // @Patch('channel/:chanId')
    // async updateChan() {
    // } 

    // //   DELETE Channel/:id
    // //   ONLY IF USER IS OWNER
    // @Delete('channel/:chanId')
    // async deleteChan() {
    // } 


    //////////////////////////////
    //  CHANNELUSER REQUESTS    //
    //////////////////////////////


    // INVITE USER
    @Post('channelUser')
    @Roles('admin')
    async addChannelUser()
    // : Promise<ChannelUser>
    {

    }
    
    // EDIT ChannelUser'S status OR role
    @Patch('channelUser/role')
    @Roles('owner')
    async editChannelUserRole(
        @GetUser('id') currentUserId: number,
        @Body() dto: ChannelUserRoleDto,
        )
    : Promise<ChannelUser>
    {
        const channelUser = await this.chatService.editChannelUserRole(currentUserId, dto);
        return channelUser;
    }

    ///////////////////
    //  BAN REQUESTS //
    ///////////////////

    @Post('channelUser/ban')
    @Roles('admin')
    async ban(@Body() dto: ChannelBanDto)
    : Promise<ChannelBan>
    {
        const channelBan = await this.chatService.banChannelUser(dto);
        return channelBan;
    }

    @Delete('channelUser/ban')
    @Roles('admin')
    async unban(dto: ChannelBanDto) 
    : Promise<ChannelBan>
    {
        const channelBan = await this.chatService.unbanChannelUser(dto);
        return channelBan;
    }

    ////////////////////
    //  MUTE REQUESTS //
    ////////////////////

    @Post('channelUser/mute')
    @Roles('admin')
    async mute(
        @Body() dto: CreateChannelMuteDto,
    )
    : Promise<ChannelMute>
    {
        const channelMute = await this.chatService.muteChannelUser(dto);
        return channelMute;
    }

    @Delete('channelUser/mute')
    @Roles('admin')
    async unmute(dto: ChannelMuteDto) 
    : Promise<ChannelMute>
    {
        const channelMute =  await this.chatService.unmuteChannelUser(dto);
        return channelMute;
    }

    @Patch('channelUser/mute')
    @Roles('admin')
    async editMute(dto: CreateChannelMuteDto)
    : Promise<ChannelMute>
    {
        const channelMute = await this.chatService.editMute(dto);
        return channelMute;
    }

}
