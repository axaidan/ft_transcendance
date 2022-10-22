import { Body, Controller, Delete, Get, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { Discussion, Channel } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { ChannelService } from './channel/channel.service';
import { CreateChannelDto } from './channel/dto/create-channel.dto';
import { ChatGateway } from './chat.gateway';
import { DiscussionService } from './discussion/discussion.service';
import { CreateDiscussionDto, DiscussionDto } from './discussion/dto';
import { DiscussionWithUsersWithMessages } from './discussion/types/DiscussionWithUsersWithMessages';

@UseGuards(JwtGuard)
@Controller()
export class ChatController {

    constructor (
        private discService: DiscussionService,
        private chanService: ChannelService,
        private chatGateway: ChatGateway,
    ) {}

    @Get('discussion')
    async getDiscussions(@GetUser('id') currentUserId: number):
        Promise<Discussion[]> {
        return await this.discService.getDiscussions(currentUserId);
    }

    //  POST /discussion/:user2Id
    @Post('discussion')
    async createDiscussion(
        @GetUser('id') currentUserId: number,
        @Body(ParseIntPipe) body : { user2Id: number }, 
    ) :
    Promise<DiscussionWithUsersWithMessages>
    {
        const dto: CreateDiscussionDto = {
            user1Id: currentUserId,
            user2Id: body.user2Id,
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
        }
        this.chatGateway.newDisc(newDiscDto);
        return discussion;
    }

    @Post('channel')
    async createChannel(
        @GetUser('id') currentUserId: number,
        @Body() createChanDto: CreateChannelDto,
    ) :
    Promise<Channel>
    {
        const channel = await this.chanService.create(createChanDto);
        return channel;
    }

    @Get('channel/all')
    async getAllChannels() :
    Promise<Channel[]>
    {
        const channels: Channel[] = await this.chanService.getAllChannels();
        return channels;
    }

    // //   DELETE Channel/:id
    // //   ONLY IF USER IS OWNER
    // @Delete('channel/:chanId')
    // async deleteChan() {
    // } 

    // //   UPDATE Channel/:id (name)
    // //   ONLY IF USER IS OWNER
    // @Patch('channel/:chanId')
    // async updateChan() {
    // } 
    
    // @Get('channel')
    // async getChannels(@GetUser('id') currentUserId: number)
    // Promise<Channel[]>
    // {
        // const channels: Channel[] = await this.chanService.getChannelsByUserId(currentUserId);
        // return channels;
    // }

}
