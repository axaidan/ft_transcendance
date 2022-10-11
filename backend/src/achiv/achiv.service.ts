import { ForbiddenException, Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class AchievementService{
	constructor(private prisma: PrismaService) {}

	async createAchiv(AchivDto: any)  {
		const newAchiv = await this.prisma.achievement.create({data: AchivDto, include: {users: true}});
		return newAchiv;
	}

	async getAchiv() { 
		const achivs = await this.prisma.achievement.findMany({include: {users: true}});
		console.log(achivs);
		return achivs;
	} 

	async updateAchiv(userId: string, achivId: string){
//		var uid: number = userId;
		let uid = parseInt(userId, 10);
		let aid = parseInt(achivId, 10);
		const user = await this.prisma.user.findFirst({ where: {id: uid}});

		const unlock = await this.prisma.achievement.update({where: {id: aid},
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

		let soldat = await this.prisma.user.findFirst({where: {id: uid}});

		let achiv = await this.prisma.achievement.findFirst({where: { id: aid }}).users({where: {id: uid}});

		if (!achiv.length)
		{
			console.log("nothing found")
			return null;
		}
		else {
		console.log(achiv);
		}
		return  achiv;

	}

	async listUnlockAchiv(meId: number) {
		var findMe = await this.prisma.user.findFirst({where: {id: meId},
		select: {
			achievements: true,
		}})

		if (!findMe)
			throw new ForbiddenException('u not exist');

		var list = await this.prisma.achievement.findMany({where: {users: {where: {id : findMe.id}}}})
		return findMe;
	}

	deleteAchiv = (AchivDto: any) => {}
}