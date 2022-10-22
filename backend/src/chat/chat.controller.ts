import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { Discussion, Channel } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateChannelDto } from './channel/dto/create-channel.dto';
import { ChatService } from './chat.service';
import { DiscussionWithUsersWithMessages } from './discussion/types/DiscussionWithUsersWithMessages';

@UseGuards(JwtGuard)
@Controller()
export class ChatController {

    constructor (
        private chatService: ChatService,
    ) {}

    @Get('discussion')
    async getDiscussions(@GetUser('id') currentUserId: number):
        Promise<Discussion[]> {
        return await this.chatService.getDiscussions(currentUserId);
    }

    //  POST /discussion/:user2Id
    @Post('discussion')
    async createDiscussion(
        @GetUser('id') currentUserId: number,
        @Body(ParseIntPipe) body : { user2Id: number }, 
    ) :
    Promise<DiscussionWithUsersWithMessages>
    {
        return this.chatService.createDiscussion(currentUserId, body.user2Id);
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

    @Get('channel/all')
    async getAllChannels() :
    Promise<Channel[]>
    {
        const channels: Channel[] = await this.chatService.getAllChannels();
        return channels;
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
