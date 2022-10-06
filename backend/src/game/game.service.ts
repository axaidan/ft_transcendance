import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Game } from "@prisma/client";

@Injectable()
export class GameService {
    constructor (
        private prisma: PrismaService,
    ) {}


        async historique(userId: number) : Promise<Game[]> {
            const arrayGame = await this.prisma.game.findMany({
                where : {
                    OR: [
                        {player1Id:userId},
                        {player2Id: userId},
                    ],
                },
                orderBy: {
                    createAt: 'desc',
                },
                take : 10,
            },);
            return arrayGame;
        }



}