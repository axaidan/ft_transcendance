import { Controller, Get, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FtGuard } from './guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@UseGuards(FtGuard)
	@HttpCode(HttpStatus.OK)
	@Get('signin')
	signin() {}

	@UseGuards(FtGuard)
	@Get('callback')
	callback( @Req() req: Request  ) {
		return this.authService.signin( req.user.toString() );
	}
}

// @Controller('auth')
// export class AuthController {

//     constructor(
//         private usersService: UsersService
//     ) {}

//     @UseGuards(IntraAuthGuard)
//     @Get('login')
//     async getUserFromIntraLogin() {}

//     @UseGuards(IntraAuthGuard)
//     @Get('intra-callback')
//     async intraCallback(@Req() req: Request) {
//         console.log("intraCallback - getting username");
//         const username = req.user.toString();
//         console.log("intraCallback - got " + username + " username");
//         const user = await this.usersService.findOne(username);
//         console.log("intraCallback - user === " + user);
//         if (user === null) {
//             console.log("intraCallback - did not find " + username);
//             await this.usersService.create(username);
//         } 
//     }
// }
