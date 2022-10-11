import { Body, Controller, Get, Post, UseGuards} from "@nestjs/common";
import { AchievementService } from './achiv.service';
import { AchivDto, LinkDto } from './dto';
import { JwtGuard } from '../auth/guard';
import { GetUser } from "src/auth/decorator";


@Controller('achiv')
export class AchivController {
	constructor(private achivService: AchievementService) {};

	@Post('create')
	createAchiv(@Body() achivDto: AchivDto){
		return this.achivService.createAchiv(achivDto);
	}

	@Get('list_all')
	getAchiv(){
		return this.achivService.getAchiv();
	}

	@Post('unlock')
	updateAchiv(@Body() dto: LinkDto){
		return this.achivService.updateAchiv(dto.userId, dto.achivId);
	}

	@Get('list_unlock')
	@UseGuards(JwtGuard)
	listUnlockAchiv(@GetUser('id') userId: number) {
		return this.achivService.listUnlockAchiv(userId);
	}

	/*

	@Get('list_lock')
	listLockAchiv(@GetUser('id') userId:number) {
		return this.achivService.listLockAchiv(userId);
	}
	*/

	@Get('findAchivForUser')
	findUserForAchivIda(@Body() dto:LinkDto) {
		return this.achivService.findUserForAchivId(dto.userId, dto.achivId);
	}


}