import { Body, Controller, Get } from "@nestjs/common";
import { GameService } from "./game.service";
import { Game } from "@prisma/client";
import { CreateGameDto } from "./dto";

@Controller('game')
export class GameController {
    constructor (private gameService: GameService) {}

    @Get('historique')
    async historique(@Body() {userId}) : Promise<Game[]>  {
        return this.gameService.historique(userId);
    }

    async createGame(@Body() dto: CreateGameDto) {
        return this.gameService.createGame(dto);
    }
}