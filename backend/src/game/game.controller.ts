import { Body, Controller, Get, Post } from "@nestjs/common";
import { GameService } from "./game.service";
import { Game } from "@prisma/client";
import { CreateGameDto, HistoriqueDto } from "./dto";

@Controller('game')
export class GameController {
    constructor (private gameService: GameService) {}


	@Post('hist')
		async hist(@Body() {userId}){ 
			var nbr = parseInt(userId, 10);
			return this.gameService.historique(nbr);
		}
	

    @Get('historique')
    async historique(@Body() dto: HistoriqueDto){
        return this.gameService.historique(dto.userId);
    }

    async createGame(@Body() dto: CreateGameDto) {
        return this.gameService.createGame(dto);
    }
}