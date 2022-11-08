import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { Socket } from "socket.io";
import { AppGateway } from "src/app.gateway";
import Lobby, {LobbyId} from "../class/lobby.class";
/**
 *  Lobby class :
 *                  id: number
 * 
 *                  player : Array<User>
 *                  spectator : Array<User>
 *              
 *                                     
 * 
 * 
 */

@Injectable()
export class LobbyService {
    // need une map de loobies pour stocker les lobbies en cours,
    // que l'on peut find avec les lobbieId
    // donc need une class lobby
    // lobbies = new Map<lobbyId, lobby>()
    
    // maybe a queue of Array<User>();

    //
    //      joinLobby
    //    
    //      push User in queue, if queue.size < 2 return;
    //      else, create a lobby were I push the two User first User in queue
    //      et je lance le match


    constructor(
        private socket: AppGateway
    ) {}

    lobbies = new Map<LobbyId, Lobby>();
    queue = new Array<number>(); // number =  UserId serait mieux

    async joinLobby(meId: number) {
        console.log('lobbyservice');
        if (await this.findUserInLobby(meId) === true) {
            console.log('tu es deja log; need to throw execption');
            return ;
        }
        console.log('user %d ,join queue ', meId);
        this.joinQueue(meId);
        if (this.queue.length < 2)
            return ;
        const u1 = this.queue.shift();
        const u2 = this.queue.shift();

        const lobbyId = await this.createLobby(u1, u2);

            // lance une game

        // at first je creer une room
        await this.socket.joinGameRoom(u1, lobbyId);
        await this.socket.joinGameRoom(u2, lobbyId);

        var lobby = this.lobbies.get(lobbyId);
        await this.socket.startGame(u1, u2, lobbyId);
		
     //   await this.socket.exitGameRoom(u1, lobbyId)
     //   await this.socket.exitGameRoom(u2, lobbyId)
    //        await this.socket.closeRoom(lobbyId);
        //start la game
        console.log('watch user in room')
        await this.socket.watchUsersInRoom(lobbyId)

    };

    async joinQueue(userId: number) {
        this.queue.push(userId);
    }

    async createLobby(userId1: number, userId2: number) {
        console.log('create a lobby with usermenber %d, and %d', userId1, userId2);
        const lobby = new Lobby();
    lobby.PlayersId.push(userId1);
    lobby.PlayersId.push(userId2);
    lobby.PalettePlayer1 = userId1;
    lobby.PalettePlayer2 = userId2;

    this.lobbies.set(lobby.LobbyId, lobby);
    console.log('id du lobby creer :', lobby.LobbyId);
    console.log(lobby.LobbyId);
    return lobby.LobbyId;
    }

	async findUserInLobby(userId: number) : Promise<boolean> {
        for (const l of this.lobbies.values()) {
            var ret = l.PlayersId.find(e => e === userId);
            if (ret) {
				console.log(l.LobbyId)
				console.log(l.PlayersId)
                return true;
            }
        }
        return false;
	}

    async findUserInLobbies(userId: number) {
   //     const lobbyArray : Lobby[] = this.lobbies.values();
    //    lobbyArray.find()
        for (const l of this.lobbies.values()) {
            var ret = l.PlayersId.find(e => e === userId);
            if (ret) {
                return l.LobbyId;
            }
        }
        return undefined;
    }

    async specLobby(lobbyId: number, meId: number) {
        console.log(`user ${meId} want to spec lobby ${lobbyId}`);
        const lobby = this.lobbies.get(lobbyId);
        if (!lobby) {
            console.log('no lobby')
            return ; // no lobby here
        }
        if (lobby.ViewersId.find(user => user === meId)) {
            console.log('already watch lobby')
            return ; // already a viewer
        }
        lobby.ViewersId.push(meId);
        this.socket.specLobby(meId, lobbyId);

    }


    async specUser(meId: number, targetId:number) {
        console.log(`user ${meId} want to spec user${targetId}`);

//        let roomId :string = await this.socket.lobbyUserInGame(targetId);
        let roomId = await this.findUserInLobbies(targetId);

        if (roomId !== undefined) {
            let looby = this.lobbies.get(roomId);
            if (looby !== undefined) {
            console.log(`${looby.LobbyId}`)
            looby.ViewersId.push(meId);
            this.socket.specLobby(meId, roomId);
            this.lstViewer(looby.LobbyId)
            }
        }
        else {
            console.log('user not in game');
        }


        
    }

    async lstViewer(lobbieId: number) {
        const lobby = this.lobbies.get(lobbieId);
        if (lobby) {
            lobby.ViewersId.forEach((value) => {
                console.log(value);
            })
        }
    }

    async quitSpecLobby(lobbyId: number, userId: number) {
        const lobby = this.lobbies.get(lobbyId);
        if (!lobby) {
            return ; // no lobby here
        }
        var idx = lobby.ViewersId.indexOf(userId);
        if (idx !== -1) {
            lobby.ViewersId.splice(idx, 1);
        }
    }

   async clearLobby(lobbyId: number) {
    this.lobbies.delete(lobbyId);
   }

    async cleanLobbyMap() {
        this.lobbies.clear();
    }
}