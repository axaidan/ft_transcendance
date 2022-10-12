import { PrismaService } from "src/prisma/prisma.service";
import { Game } from "@prisma/client";
import { CreateGameDto } from "./dto";
export declare class GameService {
    private prisma;
    constructor(prisma: PrismaService);
    history(userId: number): Promise<{
        player1: {
            id: number;
            username: string;
        };
        player2: {
            id: number;
            username: string;
        };
        score1: number;
        score2: number;
    }[]>;
    createGame(dto: CreateGameDto): Promise<Game>;
    return: any;
}
