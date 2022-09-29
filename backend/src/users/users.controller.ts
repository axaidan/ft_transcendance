import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { User } from '@prisma/client'
import { EditUserDto } from './dto/edit-user.dto';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
	constructor( private userService: UserService) {};

	@HttpCode(200)
	@Get('me')
	getme(@GetUser() user: User) {
		return user;
	}

	@Patch()
	editUser(
		@GetUser('id') userId: number,
		@Body() dto: EditUserDto
	) {
		return (this.userService.editUser(userId, dto));
	}

}
