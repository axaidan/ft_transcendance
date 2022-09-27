import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../users/users.service';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private conf: ConfigService,
		private jwt: JwtService,
		private userService: UserService ) {}

	async signin( login: string ) {
		let user = await this.prisma.user.findFirst({ where: { login: login }});
		if (!user)
			user = await this.userService.createUser( login );
		return this.signToken( user.id, user.login );
	}

	async signToken( userId: number, login: string ): Promise<{ access_token: string}>
	{ 
		const payload = { sub: userId, login }
		const secret = this.conf.get('JWT_SECRET');
		const token = await this.jwt.signAsync(payload, {expiresIn: '30m', secret: secret});
		return { access_token: token };
	}
}