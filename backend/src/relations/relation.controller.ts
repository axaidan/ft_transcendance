import { Body, Controller, Get, Post } from "@nestjs/common";
import { GetUser } from "src/auth/decorator";
import { RelationService } from "./relation.service";
import { User } from "@prisma/client";

@Controller('relation')
export class RelationController {
	constructor(private relationService: RelationService) {}

	@Post('add_friend')
	add_friend(@Body() {user, user_id_to_add}){
		return this.relationService.add_friend(user, user_id_to_add);
	}

	@Post('add')
	add_user(@Body() {user, user_id_to_add}) {
		return this.relationService.add_user(user, user_id_to_add);
	}

	@Post('block')
	block_user(@Body() {user, user_id_to_add}) {
		return this.relationService.block_user(user, user_id_to_add);
	}

	@Post('list')
	list(@Body() {user}) {
		return this.relationService.list(user);
	}

}