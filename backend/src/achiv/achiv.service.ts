import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class AchivmentService{
	constructor(private prisma: PrismaService) {}

	async createAchiv(AchivDto: any)  {
		const newAchiv = await this.prisma.achivment.create({data: AchivDto, include: {users: true}});
		return newAchiv;
	}

	async getAchiv() { 
		const achivs = await this.prisma.achivment.findMany({include: {users: true}});
		console.log(achivs);
		return achivs;
	} 

	async updateAchiv(userId: string, achivId: string){
//		var uid: number = userId;
		let uid = parseInt(userId, 10);
		let aid = parseInt(achivId, 10);
		const user = await this.prisma.user.findFirst({ where: {id: uid}});

		const unlock = await this.prisma.achivment.update({where: {id: aid},
		data: {
			users: {
				connect:[{id: user.id }]
			}
		} });
		console.log(unlock);
		return unlock;
	}

	getOneAchiv = (AchivDto: any) => {}
	deleteAchiv = (AchivDto: any) => {}
}