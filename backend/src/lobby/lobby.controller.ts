/* Function expected by lobby
    joins()
    quite()
    invite()
    watch()
*/

import { Controller, Get, Logger, Post, UseGuards } from "@nestjs/common";
import { GetUser } from "src/auth/decorator";
import { JwtGuard } from "src/auth/guard";
import { LobbyService } from "./lobby.service";

@Controller('lobby')
export class lobbyController {
    constructor(private lobbyService: LobbyService) {}
    
    logger = new Logger('Hey, Lobby Controller');

    /*
        dependence : userId
        return : lobbyId
    */
    @Get()
    getLobby() {
        console.log('helloword');
        return ;
    }

    /* 
        dependence : userId
        return : lobbyId
    */
    @Get('join')
	@UseGuards(JwtGuard)
    async joinLobby(@GetUser('id') Meid: number) {
        return this.lobbyService.joinLobby(Meid);
    }

    /*
        dependence : userId
        return : bool
     */
    @Post('leave')
    async leaveLobby() {
    }

    /*
        dependece : userId
                    second_playerId 
        return : lobbyId
     */
    @Post('inviteGame/:id')
    async inviteToLobby() {
    }


}