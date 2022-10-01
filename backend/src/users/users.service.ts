import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto/edit-user.dto';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {};

	async editUser(userId: number, dto: EditUserDto) {
		if ('username' in dto && dto.username === '') {
			// console.log('editUser() - set dto.username to null');
			dto.username = null;
		}
		// console.log(dto);
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
