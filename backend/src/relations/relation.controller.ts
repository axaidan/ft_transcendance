import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { GetUser } from "src/auth/decorator";
import { RelationService } from "./relation.service";
import { User } from "@prisma/client";
import { JwtGuard } from "src/auth/guard";
import { TargetDto } from "./dto";
import { domainToASCII } from "url";

@UseGuards(JwtGuard)
@Controller('relation')
export class RelationController {
	constructor(private relationService: RelationService) {}


	@Post('add_friend/:id')
	add_friend(@GetUser('id') meId: number, @Param('id', ParseIntPipe) userId: number){
		return this.relationService.add_friend(meId, userId);
	}

	@Post('remove_friend/:id')
	remove_friend(@GetUser('id') meId: number, @Param('id', ParseIntPipe) userId: number) {
		return this.relationService.remove_friend(meId, userId);
	}
	
	@Post('block_user/:id')
	block_user(@GetUser('id') meId: number, @Param('id', ParseIntPipe) userId: number) {
		return this.relationService.block_user(meId, userId);
	}

	@Post('unblock_user/:id')
	unblock_user(@GetUser('id') meId: number, @Param('id', ParseIntPipe) userId: number) {
		return this.relationService.unblock_user(meId, userId);
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

	@Get('is_friend/:id')
	async is_friend(@GetUser('id') meId: number, @Param('id', ParseIntPipe) userId: number) : Promise<boolean>{
		return this.relationService.is_friend(meId, userId);

	}

	@Get('is_block/:id')
	async is_block(@GetUser('id') meId: number, @Param('id', ParseIntPipe) userId: number) : Promise<boolean>{
		return this.relationService.is_block(meId, userId);
	}

}