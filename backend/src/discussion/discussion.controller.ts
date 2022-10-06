import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { DiscussionService } from './discussion.service';
import { CreateDiscussionDto } from './dto';

@Controller('discussion')
export class DiscussionController {
    
    constructor(
        private discService: DiscussionService
    ) {}

    @UseGuards(JwtGuard)
    @Post('create')
    create(@GetUser('id') userId: number, @Body() dto: CreateDiscussionDto) {
        return this.discService.create(userId, dto);
    }
}
