import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {};

	async getUser( userId: number ) {
		return await this.prisma.user.findUnique({where: { id: userId }});
	}

	async getAllUser()  {
		return await this.prisma.user.findMany(); 
	}

	async editUser(userId: number, dto: EditUserDto) {
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
}
