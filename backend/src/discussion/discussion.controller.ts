import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { DiscussionService } from './discussion.service';
import { CreateDiscussionDto } from './dto';

@UseGuards(JwtGuard)
@Controller('discussion')
export class DiscussionController {
    
    constructor(
        private discService: DiscussionService
    ) {}

    @Post('create')
    create(@GetUser('id') currentUserId: number, @Body() dto: CreateDiscussionDto, ) {
        return this.discService.create(currentUserId, dto);
    }

    @Get()
    getDiscussions(@GetUser('id') currentUserId: number) {
        return this.discService.getDiscussions(currentUserId);
    }
}
