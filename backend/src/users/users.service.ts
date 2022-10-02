import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {};

	async getUser( userId: number ) {
		return await this.prisma.user.findUnique({where: { id: userId }});
	}

	async getAllUser()  {
		return await this.prisma.user.findMany(); 
	}

}
