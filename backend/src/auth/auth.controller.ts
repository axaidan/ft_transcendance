import { Controller, Get, HttpCode, HttpStatus, UseGuards, Req, Query, Res, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FtGuard } from './guard';
import { Request, Response } from 'express';
import { GetUser } from './decorator';
import { SigninTestDto } from './dto';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) { }

	@UseGuards(FtGuard)
	@HttpCode(HttpStatus.OK)
	@Get('signin')
	signin(@Req() req: Request) { /* NOTHING TO DO HERE, I DONT KNOW */ }

	@UseGuards(FtGuard)
	@Get('callback')
	async callback(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
		let token: string;
		await this.authService.signin(req.user.toString())
			.then((res) => {
				token = res;
				response.cookie('access_token', token, {
					expires: new Date(Date.now() + 6000000)
				});
				response.redirect("http://localhost:4200/home");
			})
			.catch((e) => {
				console.log("ERROR");
				console.log(e);
				response.redirect("http://localhost:4200");
			})
	}

	@Get('2fa-callback')
	twoFaCallback(@Query() query: any, @Res({ passthrough: true }) response: Response) {

		const token = query.token;
		response.cookie('access_token', token, {
			expires: new Date(Date.now() + 6000000)
		});
		response.redirect("http://localhost:4200/home");
	}

	@Get('signin-test')
	async signinTest(
		@Query('login') login : string,
		@Res({ passthrough: true }) response: Response
	) {
		let token: string;
		console.log("AuthController - signinTest(" + login + ")");
		await this.authService.signinTest(login)
			.then((res) => {
				token = res;
				response.cookie('access_token', token, {
					expires: new Date(Date.now() + 6000000)
				});
				console.log("AuthController - redirecting to 4200/home");
				response.redirect("http://localhost:4200/home");
			})
			.catch((e) => {
				response.redirect("http://localhost:4200/signinTest");
			})
	}
}
