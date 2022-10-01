import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AchivmentService } from './achiv.service'
import { AchivDto, LinkDto } from './dto'

@Controller('achiv')
export class AchivController {
	constructor(private achivService: AchivmentService) {};

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