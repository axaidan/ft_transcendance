import { Body, Controller, Get, HttpCode, Post, UseGuards } from "@nestjs/common";
import { GetUser } from "src/auth/decorator";
import { RelationService } from "./relation.service";
import { User } from "@prisma/client";
import { JwtGuard } from "src/auth/guard";
import { throws } from "assert";

@Controller('relation')
export class RelationController {
	constructor(private relationService: RelationService) {}


	@UseGuards(JwtGuard)
	@Post('add_friend')
	add_friend(@GetUser('id') meId: number, @Body() {userId}){
		return this.relationService.add_friend(meId, userId);
	}

	@UseGuards(JwtGuard)
	@Post('remove_friend')
	remove_friend(@GetUser('id') meId: number, @Body() {userId}) {
		return this.relationService.remove_friend(meId, userId);
	}
	
	@UseGuards(JwtGuard)
	@Post('block_user')
	block_user(@GetUser('id') meId: number, @Body() {userId}) {
		return this.relationService.block_user(meId, userId);
	}

	@UseGuards(JwtGuard)
	@Post('unblock_user')
	unblock_user(@GetUser('id') meId: number, @Body() {userId}) {
		return this.relationService.unblock_user(meId, userId);
	}

	@UseGuards(JwtGuard)
	@Get('list_friend')
	async list(@GetUser('id') user: number) : Promise<User[]>{

		const array = await this.relationService.list_friend(user);
		return array;
	}

	@UseGuards(JwtGuard)
	@Get('list_block')
	async list_block(@GetUser('id') user: number) : Promise<User[]> {
		const array = await this.relationService.list_block(user);
		return array;
	}



}