import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './users.service';

@Controller('user')
export class UserController {
	constructor( private userService: UserService) {};

	@Post('create')
	@HttpCode(HttpStatus.OK)
	createUser( login: string ) {
		return this.userService.createUser(login);
	}


}
