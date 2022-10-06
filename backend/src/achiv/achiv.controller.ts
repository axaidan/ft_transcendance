import { Body, Controller, Get, Post, UseGuards} from "@nestjs/common";
import { AchievementService } from './achiv.service';
import { AchivDto, LinkDto } from './dto';
import { JwtGuard } from '../auth/guard';


@UseGuards(JwtGuard)
@Controller('achiv')
export class AchivController {
	constructor(private achivService: AchievementService) {};

	@Post('create')
	createAchiv(@Body() achivDto: AchivDto){
		return this.achivService.createAchiv(achivDto);
	}

	@Get('list')
	getAchiv(){
		return this.achivService.getAchiv();
	}

	@Post('unlock')
	updateAchiv(@Body() dto: LinkDto){
		return this.achivService.updateAchiv(dto.userId, dto.achivId);
	}

	@Post('findAchivFor')
	findUserForAchivIda(@Body() dto:LinkDto) {
		return this.achivService.findUserForAchivId(dto.userId, dto.achivId);
	}
}