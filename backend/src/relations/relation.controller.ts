import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { GetUser } from "src/auth/decorator";
import { RelationService } from "./relation.service";
import { User } from "@prisma/client";
import { JwtGuard } from "src/auth/guard";

// @UseGuards(JwtGuard)
@Controller('relation')
export class RelationController {
	constructor(private relationService: RelationService) {}

	// @Post('add_friend')
	// add_friend(@Body() {user, user_to_check}){
	// 	console.log("test: ")
	// 	console.log(user)
	// 	console.log(user_to_check)
	// 	return this.relationService.add_friend(user, user_to_check);
	// }

	@UseGuards(JwtGuard)
	@Post('add_friend')
	add_friend(@GetUser('id') userId: number, @Body() {user_to_check}){
		console.log("test: ")
		// console.log(user)
		console.log(user_to_check)

		return this.relationService.add_friend(userId.toString(), user_to_check);
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
	list(@Body() {user}) {
		return this.relationService.list(user);
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