import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../users/users.service';
import { JwtService } from "@nestjs/jwt";
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private conf: ConfigService,
		private jwt: JwtService,
		private mailService: MailService ) {}

	async signin( login: string ) {
		let user = await this.prisma.user.findFirst({ where: { login: login }});
		if (!user)
		user = await this.prisma.user.create({
			data: {
				login: login,
				email: login + '@student.42.fr',
			}
		});
		const token = await this.signToken( user.id, user.login ); 
		
		if (user.twoFactorAuth === true) {
			this.mailService.sendLoginToken(user, token.access_token);
			return undefined;	// SHOULD RETURN INFO TO MAKE A
								// "CHECK YOUR MAIL TO LOGIN"
								// WINDOW POP-UP
		}
		return token;
	}

	async signToken( userId: number, login: string ): Promise<{access_token: string}> { 
		const payload = { sub: userId, login }
		const secret = this.conf.get('JWT_SECRET');
		const token = await this.jwt.signAsync(payload, {expiresIn: '30m', secret: secret});
		return { access_token: token };
	}
}