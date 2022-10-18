import { BadRequestException, ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AppGateway } from 'src/app.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UserService {

    private websockets = new Map<number, string>();

	constructor(
		private prisma: PrismaService,
    	@Inject(forwardRef(() => AppGateway))
		private appGateway: AppGateway,
		) {};

	get wsMap() {
        return this.websockets;
    }

	async createUser(login : string) {
	return await this.prisma.user.create({
			data: {
				login: login,
				username: login,
				email: login + '@student.42.fr',
				avatarId: 1,
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
}
