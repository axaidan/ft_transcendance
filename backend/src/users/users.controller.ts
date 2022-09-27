import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { GetUser } from '../auth/decorator';
import { JwtGuard, FtGuard } from '../auth/guard';
import { User } from '@prisma/client'

@Controller('user')
export class UserController {
	constructor( private userService: UserService) {};

	@UseGuards(JwtGuard)
	@Get('me')
	getme(@GetUser() user: User) {
		return user;
	}

	@UseGuards(FtGuard)
	@Post('create')
	@HttpCode(HttpStatus.OK)
	createUser( login: string ) {
		return this.userService.createUser(login);
	}

}
