import { ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UserService {

    private websockets = new Map<number, string>();

	constructor( private prisma: PrismaService ) {};

	async createUser(login : string) {
	return await this.prisma.user.create({
			data: {
				login: login,
				username: login,
				email: login + '@student.42.fr',
				avatarUrl: "",
				ranking: 1000,
			}
		});
	}

	async getUser( userId: number ) {
		return await this.prisma.user.findUnique({where: { id: userId }});
	}

	async getAllUser()  {
		return await this.prisma.user.findMany(); 
	}

	async editUser(userId: number, dto: EditUserDto) {
		try {
			const user = await this.prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					...dto,				
				}
			});
			return user;
		}
		catch(e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2002') {
					throw new ForbiddenException('username already taken')
				} 
			}
		}
	}

	async isUser(userName: string ) {
		let user = await this.prisma.user.findFirst({where: {username: userName}});
		if (user) {
			return true;
		}
		return false;
	}

	async getUserIdByName(userName: string ) {
		let user = await this.prisma.user.findFirst({where: {username: userName}});
		if (user) {
			return user.id;
		}
		return undefined;
	}
}
