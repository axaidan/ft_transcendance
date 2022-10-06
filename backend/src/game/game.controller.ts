import { Body, Controller, Get } from "@nestjs/common";
import { GameService } from "./game.service";
import { Game } from "@prisma/client";

@Controller('game')
export class GameController {
    constructor (private gameService: GameService) {}

    @Get('historique')
    async historique(@Body() {userId}) : Promise<Game[]>  {
        return this.gameService.historique(userId);
    }

}