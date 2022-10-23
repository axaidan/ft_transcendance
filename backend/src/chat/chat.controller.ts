import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { Discussion, Channel } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateChannelDto } from './channel/dto/create-channel.dto';
import { ChatService } from './chat.service';
import { CreateDiscussionBodyDto } from './discussion/dto';
import { DiscussionWithUsersWithMessages } from './discussion/types/DiscussionWithUsersWithMessages';

@UseGuards(JwtGuard)
@Controller()
export class ChatController {

    constructor (
        private chatService: ChatService,
    ) {}

    @Get('discussion')
    async getDiscussions(@GetUser('id') currentUserId: number) :
    Promise<Discussion[]>
    {
        return await this.chatService.getDiscussions(currentUserId);
    }

    //  POST /discussion/:user2Id
    @Post('discussion')
    async createDiscussion(
        @GetUser('id') currentUserId: number,
        @Body() body: CreateDiscussionBodyDto, 
    ) :
    Promise<DiscussionWithUsersWithMessages>
    {
        return this.chatService.createDiscussion(currentUserId, body.user2Id);
    }

    @Get('channel/all')
    async getAllPublicChannels(@GetUser('id') currentUserId: number) :
    Promise<Channel[]>
    {
        const channels: Channel[] = await this.chatService.getAllPublicChannels(currentUserId);
        return channels;
    }

    @Get('channel')
    async getAllChannelsForUser(
        @GetUser('id') currentUserId: number,
    )
    : Promise<Channel[]>
    {
        const channels: Channel[] = await this.chatService.getAllChannelsForUser(currentUserId);
        // channels[0]['userStatus'] = 1;
        return channels;
    }

    @Post('channel')
    async createChannel(
        @GetUser('id') currentUserId: number,
        @Body() createChanDto: CreateChannelDto,
    ) :
    Promise<Channel>
    {
        const channel = await this.chatService.createChannel(currentUserId, createChanDto);
        return channel;
    }

    // //   DELETE Channel/:id
    // //   ONLY IF USER IS OWNER
    // @Delete('channel/:chanId')
    // async deleteChan() {
    // } 

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
