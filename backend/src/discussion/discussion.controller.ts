import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { Discussion } from '@prisma/client';
import { blockParams } from 'handlebars';
// import { blockParams } from 'handlebars';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { DiscussionService } from './discussion.service';
import { CreateDiscussionDto, GetDiscussionDto, GetDiscussionMessagesDto } from './dto';

@UseGuards(JwtGuard)
@Controller('discussion')
export class DiscussionController {
    
    constructor(
        private discService: DiscussionService
    ) {}

    @Get('user/:id')
    async getMessagesByUserId (
        @GetUser('id') currentUserId: number,
        @Param('id', ParseIntPipe) user2Id: number
    ) :
    Promise<GetDiscussionMessagesDto>
    {
        return await this.discService.getMessagesByUserId(currentUserId, user2Id);
    }

    @Get(':id')
    async getMessagesByDiscId(@Param('id', ParseIntPipe) discId: number) :
    Promise<GetDiscussionMessagesDto>
    {
        return await this.discService.getMessagesByDiscId(discId);
    }

    @Get()
    async getDiscussions(@GetUser('id') currentUserId: number) :
    Promise<Discussion[]>
    {
        return await this.discService.getDiscussions(currentUserId);
    }
}
