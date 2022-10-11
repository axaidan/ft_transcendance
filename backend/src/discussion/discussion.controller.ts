import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
// import { blockParams } from 'handlebars';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { DiscussionService } from './discussion.service';
import { DiscussionDto } from './dto';

@UseGuards(JwtGuard)
@Controller('discussion')
export class DiscussionController {
    
    constructor(
        private discService: DiscussionService
    ) {}

    @Post('create')
    create(@GetUser('id') currentUserId: number, @Body() dto: DiscussionDto, ) {
        return this.discService.create(currentUserId, dto);
    }

    // WHERE :id IS A USER_ID
    // (SHOULD BE ABLE TO DO JUST WITH A DISCUSSION_ID  )
    // (WILL SEE WHEN INTEGRATED                        )
    // @Get(':userid')
    // async getMessagesByUserId(
    //     @GetUser('id') currentUserId: number,
    //     @Param('userid', ParseIntPipe) user2Id: number
    //     ) {
    //     const discId: number = await this.discService.findIdByUserId(currentUserId, user2Id);
    //     // console.log('=== getMessages() discId === ' + discId);
    //     if (!discId) {
    //         return [];
    //     }
    //     return this.discService.getMessagesbyDiscId(discId);
    // }

    @Get(':userid')
    async getMessagesByUserId(
        @GetUser('id') currentUserId: number,
        @Param('userid', ParseIntPipe) user2Id: number
        ) {
        const discId: number = await this.discService.findIdByUserId(
            currentUserId,
            user2Id
            );
        if (!discId) {
            return [];
        }
        return this.discService.getMessagesbyDiscId(discId);
    }

    @Get()
    getDiscussions(@GetUser('id') currentUserId: number) {
        return this.discService.getDiscussions(currentUserId);
    }
}
