import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { Discussion, Channel, ChannelUser } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { domainToASCII } from 'url';
import { ChannelUserRoleDto, ChannelUserStatusDto } from './channel/channel-user/dto';
import { ChannelDto, CreateChannelDto } from './channel/dto';
import { ChatService } from './chat.service';
import { CreateDiscussionBodyDto } from './discussion/dto';
import { DiscussionWithUsers } from './discussion/types';

@UseGuards(JwtGuard)
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

    @Post('channel/join')
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

    //////////////////////////////
    //  CHANNELUSER REQUESTS    //
    //////////////////////////////

    // EDIT A Channel
    // @Patch('channel')
    // @Roles('owner')
    // async editChannel() {

    // }

    // //   DELETE Channel/:id
    // //   ONLY IF USER IS OWNER
    // @Delete('channel/:chanId')
    // async deleteChan() {
    // } 

    // INVITE USER
    @Post('channelUser')
    //@Roles(['admin', 'owner'])
    async addChannelUser()
    // : Promise<ChannelUser>
    {

    }
    
    // EDIT ChannelUser'S status OR role
    @Patch('channelUser/role')
    //@Roles(['admin', 'owner'])
    async editChannelUserRole(
        @GetUser('id') currentUserId: number,
        @Body() dto: ChannelUserRoleDto,
        )
    : Promise<ChannelUser>
    {
        const channelUser = await this.chatService.editChannelUserRole(currentUserId, dto);
        return channelUser;
    }

    @Patch('channelUser/status')
    //@Roles(['admin', 'owner'])
    async editChannelUserstatus(
        @GetUser('id') currentUserId: number,
        @Body() dto: ChannelUserStatusDto
    )
    : Promise<ChannelUser>
    {
        const channelUser = await this.chatService.editChannelUserStatus(currentUserId, dto);
        return channelUser;

    }

    // //   UPDATE Channel/:id (name)
    // //   ONLY IF USER IS OWNER
    // //   INVITE OTHER User
    // //   IF CurrentUser ID ADMIN
    // @Patch('channel/:chanId')
    // async updateChan() {
    // } 

    // @Get('channel')
    // async getChannels(@GetUser('id') currentUserId: number)
    // Promise<Channel[]>
    // {
    // const channels: Channel[] = await this.channelService.getChannelsByUserId(currentUserId);
    // return channels;
    // }

}
