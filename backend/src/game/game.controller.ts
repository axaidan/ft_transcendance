import { Body, Controller, Get } from "@nestjs/common";
import { GameService } from "./game.service";
import { Game } from "@prisma/client";
import { CreateGameDto, HistoriqueDto } from "./dto";

@Controller('game')
export class GameController {
    constructor (private gameService: GameService) {}

    @Get('historique')
    async historique(@Body() dto: HistoriqueDto){
        return this.gameService.historique(dto.userId);
    }

    async createGame(@Body() dto: CreateGameDto) {
        return this.gameService.createGame(dto);
    }
}