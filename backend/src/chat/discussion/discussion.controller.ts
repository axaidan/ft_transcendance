import { Body, Controller, Get, Logger, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { Discussion } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { DiscussionService } from './discussion.service';
import { CreateDiscussionDto } from './dto';


@UseGuards(JwtGuard)
@Controller('discussion')
export class DiscussionController {

	private logger: Logger = new Logger('DiscController');

    constructor(
        private discService: DiscussionService
    ) { }

    //  GET /discussion
    @Get()
    async getDiscussions(@GetUser('id') currentUserId: number):
        Promise<Discussion[]> {
        this.logger.log(`USER ${currentUserId} RETRIEVED ALL HIS Discussion`);
        return await this.discService.getDiscussions(currentUserId);
    }

    //  POST /discussion/:user2Id
    @Post()
    async createDiscussion(
        @GetUser('id') currentUserId: number,
        @Body(/*ParseIntPipe*/) body : { user2Id: number }, 
    ) :
    Promise<Discussion>
    {
        const dto: CreateDiscussionDto = {
            user1Id: currentUserId,
            user2Id: body.user2Id,
        };
		this.logger.log(`USER ${currentUserId} CREATING DISC W/ USER ${body.user2Id}`)
        const discussion = await this.discService.create(dto);
        this.logger.log(`USER ${currentUserId} CREATED NEW Discussion W/ USER ${body.user2Id}`);
        return discussion;
    }
}
