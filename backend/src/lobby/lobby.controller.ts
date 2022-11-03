/* Function expected by lobby
    joins()
    quite()
    invite()
    watch()
*/

import { Controller, Delete, Get, Logger, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
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
	@UseGuards(JwtGuard)
    getLobby(@GetUser('id') meId: number) {
        console.log('getLobby:');
        console.log(meId);
        var test = this.lobbyService.findUserInLobbies(meId);
        if (test)
            console.log(test);
        else
            console.log('pas de user dans les lobby')

        return test;
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

    @Get('spec/:id')
    @UseGuards(JwtGuard)
    async specUser(@GetUser('id') meId: number, @Param('id', ParseIntPipe) targetId:number){
        return this.lobbyService.specUser(meId, targetId);

    }

    /*
        dependece : userId
                    second_playerId 
        return : lobbyId
     */
    @Post('inviteGame/:id')
    async inviteToLobby() {
    }


    @Delete('cleanAll') // dev part
    async cleanAll() {
        return this.lobbyService.cleanLobbyMap();
    }

}