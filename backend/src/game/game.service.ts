import { ConsoleLogger, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Game } from "@prisma/client";
import { CreateGameDto } from "./dto";

@Injectable()
export class GameService {
	constructor(
		private prisma: PrismaService,
	) { }


	async history(userId: number) {

		const arrayGame = await this.prisma.game.findMany({
			where: {
				OR: [
					{ player1Id: userId },
					{ player2Id: userId },
				],
			},
			orderBy: {
				createAt: 'desc',
			},
			take: 10,
			select: {
				score1: true,
				player1: { select: { id: true, username: true, avatarUrl: true, }, },
				score2: true,
				player2: { select: { id: true, username: true, avatarUrl: true, }, },
			}

		},);
		return arrayGame;
	}

	async createGame(dto: CreateGameDto) {
		if (dto.score1 < 0 || dto.score2 < 0)
			throw new ForbiddenException('score negatif error')
		let findUser1 = await this.prisma.user.findFirst({ where: { id: dto.userId1 } })
		let findUser2 = await this.prisma.user.findFirst({ where: { id: dto.userId2 } })

		if (!findUser1 || !findUser2)
			throw new ForbiddenException('score negatif error')
		const newGame = await this.prisma.game.create({
			data: {
				player1Id: dto.userId1,
				player2Id: dto.userId2,
				score1: dto.score1,
				score2: dto.score2,
			}
		})
		if (dto.score1 > dto.score2) {

			await this.prisma.user.update({
				where: { id: findUser1.id },
				data: {
					ranking: findUser1.ranking + 10
				},
			});
			await this.prisma.user.update({
				where: { id: findUser2.id },
				data: {
					ranking: findUser2.ranking - 10,
				},
			});
		}
		else {

			await this.prisma.user.update({
				where: { id: findUser2.id },
				data: {
					ranking: findUser2.ranking + 10
				},
			});
			await this.prisma.user.update({
				where: { id: findUser1.id },
				data: {
					ranking: findUser1.ranking - 10
				},
			});
		}
		return newGame;
	}
	// return ;

}