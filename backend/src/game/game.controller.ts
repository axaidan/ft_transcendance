import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { GameService } from "./game.service";
import { Game } from "@prisma/client";
import { CreateGameDto, HistoriqueDto } from "./dto";

@Controller('game')
export class GameController {
	constructor(private gameService: GameService) { }


	@Post('hist')
	async hist(@Body() { userId }) {
		var nbr = parseInt(userId, 10);
		return this.gameService.history(nbr);
	}


	@Get('historique/:id')
	async historique(@Param('id', ParseIntPipe) userId: number) {
		return this.gameService.history(userId);
	}


	// async createGame(@Body() dto: CreateGameDto) {
	//     return this.gameService.createGame(dto);
	// }
}