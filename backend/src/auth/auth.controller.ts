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
