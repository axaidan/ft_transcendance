import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from "@nestjs/jwt";
import { MailService } from '../mail/mail.service';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private conf: ConfigService,
		private jwt: JwtService,
		private userService: UserService,
		private mailService: MailService) { }


	async signin(login: string) {
		let user = await this.prisma.user.findFirst({ where: { login: login } });

		var findAvatar = await this.prisma.avatar.findFirst({ where: { is_public: true } });
		if (!user) {
			user = await this.prisma.user.create({
				data: {
					login: login,
					username: null,
					email: login + '@student.42.fr',
					ranking: 1000,
				}
			});

			if (findAvatar) {
				let addAvatar = await this.prisma.user.update({
					where: { id: user.id },
					data: {
						avatarUrl: findAvatar.url,
					},
				});
			}
		}

		const token = await this.signToken(user.id, user.login);
		if (user.twoFactorAuth === true) {
			this.mailService.sendLoginToken(user, token.access_token);
			return undefined;	// SHOULD RETURN INFO TO MAKE A
			// "CHECK YOUR MAIL TO LOGIN"
			// WINDOW POP-UP
		}

		// console.log(token.access_token);
		return token.access_token;

	}

	async signToken(userId: number, login: string): Promise<{ access_token: string }> {
		const payload = { sub: userId, login }
		const secret = this.conf.get('JWT_SECRET');
		const token = await this.jwt.signAsync(payload, { expiresIn: '30m', secret: secret });
		return { access_token: token };
	}


	//	FAKE-USER-BEGIN !!!
	async signinTest(login: string) {
		let user = await this.prisma.user.findFirst({ where: { login: login } });
		if (!user) {
			throw new NotFoundException(`TEST SIGNIN FAILED - USER ${login} NOT FOUND`);
		};
		const token = await this.signToken(user.id, user.login);
		if (user.twoFactorAuth === true) {
			this.mailService.sendLoginToken(user, token.access_token);
			return undefined;	// SHOULD RETURN INFO TO MAKE A
			// "CHECK YOUR MAIL TO LOGIN"
			// WINDOW POP-UP
		}
		return token.access_token;
	}
	//	FAKE-USER-END !!!
}