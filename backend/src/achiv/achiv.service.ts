import { ForbiddenException, Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class AchievementService {
	constructor(private prisma: PrismaService) { }

	async createAchiv(AchivDto: any) {
		const newAchiv = await this.prisma.achievement.create({ data: AchivDto, include: { users: true } });
		return newAchiv;
	}

	async getAchiv() {
		const achivs = await this.prisma.achievement.findMany({ include: { users: true } });
		return achivs;
	}

	async updateAchiv(userId: string, achivId: string) {
		//		var uid: number = userId;
		let uid = parseInt(userId, 10);
		let aid = parseInt(achivId, 10);
		const user = await this.prisma.user.findFirst({ where: { id: uid } });

		const unlock = await this.prisma.achievement.update({
			where: { id: aid },
			data: {
				users: {
					connect: [{ id: user.id }]
				}
			}
		});
		return unlock;
	}

	async findUserForAchivId(userId: string, achivId: string) {
		let uid = parseInt(userId, 10);
		let aid = parseInt(achivId, 10);

		let soldat = await this.prisma.user.findFirst({ where: { id: uid } });

		let achiv = await this.prisma.achievement.findFirst({ where: { id: aid } }).users({ where: { id: uid } });

		if (!achiv.length) {
			return false;
		}
		else {
			return true;
		}

	}

	async listUnlockAchiv(meId: number) {
		var findMe = await this.prisma.user.findFirst({
			where: { id: meId },
		})

		if (!findMe)
			throw new ForbiddenException('u not exist');

		var list = await this.prisma.achievement.findMany({
			where: { users: { some: findMe } },
		})
		return list;
	}

	async listLockAchiv(meId: number) {
		var findMe = await this.prisma.user.findFirst({
			where: { id: meId },
		})

		if (!findMe)
			throw new ForbiddenException('u not exist');

		var list = await this.prisma.achievement.findMany({
			where: { users: { none: findMe } },
		})
		return list;

	}

	deleteAchiv = (AchivDto: any) => { }
}