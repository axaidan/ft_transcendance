import { Controller, Get, HttpCode, HttpStatus, UseGuards, Req, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FtGuard } from './guard';
import { Request } from 'express';
import { GetUser } from './decorator';
import { User } from '@prisma/client';

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

	@Get('2fa-callback')
	twoFaCallback(@Query() query: any) {
		return {
			access_token: query.token
		};
	}
}
