import { Body, Controller, Get, Post } from "@nestjs/common";
import { GetUser } from "src/auth/decorator";
import { RelationService } from "./relation.service";
import { User } from "@prisma/client";

@Controller('relation')
export class RelationController {
	constructor(private relationService: RelationService) {}

	@Post('add_friend')
	add_friend(@Body() {user, user_to_check}){
		return this.relationService.add_friend(user, user_to_check);
	}

	@Post('add')
	add_user(@Body() {user, user_to_check}) {
		return this.relationService.add_user(user, user_to_check);
	}

	@Post('block')
	block_user(@Body() {user, user_to_check}) {
		return this.relationService.block_user(user,user_to_check );
	}

	@Post('list')
	async list(@Body() {user}) : Promise<User[]>{
		const array = await this.relationService.list(user);
		return array;
	}

	@Post('list_block')
	list_block(@Body() {user}) {
		return this.relationService.list_block(user);
	}

	@Post('is_friend')
	is_my_friend(@Body() {user, user_to_check}) {
		return this.relationService.is_my_friend(user,user_to_check  )
	}

}