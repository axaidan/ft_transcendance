import { Body, Controller, Get, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { Discussion } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { ChatGateway } from './chat.gateway';
import { DiscussionService } from './discussion/discussion.service';
import { CreateDiscussionDto, DiscussionDto } from './discussion/dto';
import { DiscussionWithUsersWithMessages } from './discussion/types/DiscussionWithUsersWithMessages';

@UseGuards(JwtGuard)
@Controller('')
export class ChatController {

    constructor (
        private discService: DiscussionService,
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
        const newDiscDto: DiscussionDto = {
            user1Id: discussion.user1Id,
            user2Id: discussion.user2Id,
            username1: discussion.user1.username,
            username2: discussion.user2.username,
            id: discussion.id,
        }
        this.chatGateway.joinDiscRoom(discussion.user1Id, discussion.id);
        this.chatGateway.joinDiscRoom(discussion.user2Id, discussion.id);
        this.chatGateway.newDisc(newDiscDto);
        return discussion;
    }

}
