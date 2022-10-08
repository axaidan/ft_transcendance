import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { GetUser } from "src/auth/decorator";
import { RelationService } from "./relation.service";
import { User } from "@prisma/client";
import { JwtGuard } from "src/auth/guard";
import { TargetDto } from "./dto";

@UseGuards(JwtGuard)
@Controller('relation')
export class RelationController {
	constructor(private relationService: RelationService) {}

	@Post('add_friend/:id')
	add_friend(@GetUser('id') meId: number, @Param('id', ParseIntPipe) cible_id: number){
		return this.relationService.add_friend(meId, cible_id);
	}

	@Post('remove_friend/:id')
	remove_friend(@GetUser('id') meId: number, @Param('id', ParseIntPipe) cible_id: number) {
		return this.relationService.remove_friend(meId, cible_id);
	}
	
	@Post('block_user')
	block_user(@GetUser('id') meId: number, @Body() dto: TargetDto) {
		return this.relationService.block_user(meId, dto.userId);
	}

	@Post('unblock_user')
	unblock_user(@GetUser('id') meId: number, @Body() dto: TargetDto) {
		return this.relationService.unblock_user(meId, dto.userId);
	}

	@Get('list_friend')
	async list(@GetUser('id') user: number) : Promise<User[]>{

		const array = await this.relationService.list_friend(user);
		return array;
	}

	@Get('list_block')
	async list_block(@GetUser('id') user: number) : Promise<User[]> {
		const array = await this.relationService.list_block(user);
		return array;
	}

}