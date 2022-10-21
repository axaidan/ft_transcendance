import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import Lobby, {LobbyId} from "src/class/lobby.class";
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

    lobbies = new Map<LobbyId, Lobby>();
    queue = new Array<number>(); // number =  UserId serait mieux

    async joinLobby(meId: number) {
        console.log('lobbyservice');
   /*     if (findUserInLobby(meId)) {
            console.log('tu es deja log; need to throw execption');
            return ;
        }*/
        console.log('user join queue');
        this.joinQueue(meId);
        if (this.queue.length < 2)
            return ;
        const u1 = this.queue.shift();
        const u2 = this.queue.shift();
        this.createLobby(u1, u2);



    };

    async joinQueue(userId: number) {
        this.queue.push(userId);
    }

    async createLobby(userId1: number, userId2: number) {
        console.log('create a lobby');
        const test = new Lobby();
    test.usersId.push(userId1);
    test.usersId.push(userId2);
    this.lobbies.set(test.LobbyId, test);
    console.log('id du lobby creer :', test.LobbyId);
    console.log(test.LobbyId);
    }

    async findUserInLobbies(userId: number) {
   //     const lobbyArray : Lobby[] = this.lobbies.values();
    //    lobbyArray.find()
        for (const l of this.lobbies.values()) {
            var ret = l.usersId.find(e => e === userId);
            if (ret) {
                return l.LobbyId;
            }
        }
        return ;
        
    }

   async clearLobby(lobbyId: number) {
    this.lobbies.delete(lobbyId);
   }

    async cleanLobbyMap() {
        this.lobbies.clear();
    }
}