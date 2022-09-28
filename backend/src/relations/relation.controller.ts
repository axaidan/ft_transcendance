import { Controller, Get } from "@nestjs/common";
import { GetUser } from "src/auth/decorator";
import { RelationService } from "./relation.service";
import { User } from "@prisma/client";

@Controller('relation')
export class RelationController {
	constructor(private relationService: RelationService) {}

	@Get('add')
	add_user(@GetUser() user: User, user_id_to_add: number) {
		return ;
	}


}