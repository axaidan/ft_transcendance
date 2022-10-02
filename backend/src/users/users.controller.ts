import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { GetUser } from '../auth/decorator';
import { JwtGuard, FtGuard } from '../auth/guard';
import { User } from '@prisma/client'

// @UseGuards(JwtGuard)

@Controller('user')
export class UserController {
	constructor( private userService: UserService) {};

	@Get('all')
	getAllUsers() {
		return this.userService.getAllUser();
	}

	// @Get('me')
	// getme(@GetUser() user: User) {
	// 	return user;
	// }

	// @Get(':id')
	// getUserById( @Param('id', ParseIntPipe) userId: number ) {
	// 	return this.userService.getUser(userId);
	// }

}

