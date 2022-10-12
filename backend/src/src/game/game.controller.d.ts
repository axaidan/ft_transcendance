import { GameService } from "./game.service";
import { Game } from "@prisma/client";
import { CreateGameDto } from "./dto";
export declare class GameController {
    private gameService;
    constructor(gameService: GameService);
    hist({ userId }: {
        userId: any;
    }): Promise<{
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
    historique(userId: number): Promise<{
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
}
