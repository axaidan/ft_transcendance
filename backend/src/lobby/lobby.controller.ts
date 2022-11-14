/* Function expected by lobby
	joins()
	quite()
	invite()
	watch()
*/

import { Controller, Delete, Get, Logger, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { get } from "http";
import { GetUser } from "src/auth/decorator";
import { JwtGuard } from "src/auth/guard";
import { LobbyService } from "./lobby.service";

@Controller('lobby')
export class lobbyController {
	constructor(private lobbyService: LobbyService) { }

	logger = new Logger('Hey, Lobby Controller');

	/*
		dependence : userId
		return : lobbyId
	*/
	@Get()
	@UseGuards(JwtGuard)
	getLobby(@GetUser('id') meId: number) {
		var test = this.lobbyService.findUserInLobbies(meId);
		return test;
	}

	/* 
		dependence : userId
		return : lobbyId
	*/
	@Get('join/:id')
	@UseGuards(JwtGuard)
	async joinLobby(@GetUser('id') Meid: number, @Param('id', ParseIntPipe) mode: number) {
		return this.lobbyService.joinLobby(Meid, mode);
	}

	/*
		dependence : userId
		return : bool
	 */
	@Post('leave')
	async leaveLobby() {
	}


	@Get('quiteQueue')
	@UseGuards(JwtGuard)
	async quitqueue(@GetUser('id') meId: number) {
		return this.lobbyService.quitQueue(meId);
	}


	@Get('spec/:id')
	@UseGuards(JwtGuard)
	async specUser(@GetUser('id') meId: number, @Param('id', ParseIntPipe) targetId: number) {
		return this.lobbyService.specUser(meId, targetId);

	}

	/*
		dependece : userId
					second_playerId 
		return : lobbyId
	 */
	@Post('inviteGame/:id')
    @UseGuards(JwtGuard)
	async inviteToLobby(@GetUser('id')meId: number, @Param('id', ParseIntPipe) targetId:number) {
        return this.lobbyService.inviteToLobby(meId, targetId);
	}


	@Delete('cleanAll') // dev part
	async cleanAll() {
		return this.lobbyService.cleanLobbyMap();
	}

}