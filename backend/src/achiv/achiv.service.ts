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

	async findUserForAchivId(userId: string, achivId:string){
		let uid = parseInt(userId, 10);	
		let aid = parseInt(achivId, 10);

		const soldat = await this.prisma.user.findFirst({where: {id: uid}});

		const achiv = await this.prisma.achivment.findFirst({where: { id: aid }}).users({where: {id: uid}});

		if (!achiv.length)
		{
			console.log("nothing found")
			return "no achiv found for user";
		}
		else {
		console.log(achiv);
		}
		return  achiv;

	}

	deleteAchiv = (AchivDto: any) => {}
}