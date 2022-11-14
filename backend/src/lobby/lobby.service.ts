import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { AppGateway } from "src/app.gateway";
import { RelationService } from "src/relations/relation.service";
import Lobby, { LobbyId } from "../class/lobby.class";
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
		@Inject(forwardRef(() => AppGateway))
		private socket: AppGateway,
        private relation: RelationService,
        
	) { }

	lobbies = new Map<LobbyId, Lobby>();
	queue = new Array<number>(); // number =  UserId serait mieux
	queueShortPad = new Array<number>(); // number =  UserId serait mieux
	queueFastBall = new Array<number>(); // number =  UserId serait mieux

	async joinLobby(meId: number, mode: number) {
		if (await this.findUserInLobby(meId) === true) {
			return;
		}
		if (await this.findUserInQueue(meId, mode) === true) {
			return;
		}

		this.joinQueue(meId, mode);
		let u1: number;
		let u2: number;
		if (mode === 1) {
			if (this.queueShortPad.length < 2)
				return;
			u1 = this.queueShortPad.shift();
			u2 = this.queueShortPad.shift();
			this.getUsersOffQueues(u1, u2);
		}
		else if (mode === 2) {
			if (this.queueFastBall.length < 2)
				return;
			u1 = this.queueFastBall.shift();
			u2 = this.queueFastBall.shift();
			this.getUsersOffQueues(u1, u2);
		}
		else {
			if (this.queue.length < 2)
				return;
			u1 = this.queue.shift();
			u2 = this.queue.shift();
			this.getUsersOffQueues(u1, u2);
		}

		const lobbyId = await this.createLobby(u1, u2, mode);

		// lance une game

		// at first je creer une room
		await this.socket.joinGameRoom(u1, lobbyId);
		await this.socket.joinGameRoom(u2, lobbyId);

		var lobby = this.lobbies.get(lobbyId);
		await this.socket.startGame(u1, u2, lobbyId, mode);

		//   await this.socket.exitGameRoom(u1, lobbyId)
		//   await this.socket.exitGameRoom(u2, lobbyId)
		//        await this.socket.closeRoom(lobbyId);
		//start la game
		await this.socket.watchUsersInRoom(lobbyId)

	};


	async findUserInQueue(meId: number, mode: number) {
		let idx: number;
		if (mode === 0) {
			idx = this.queue.indexOf(meId);
			if (idx !== -1) {
				return true;
			}
			return false;
		}
		if (mode === 2) {
			idx = this.queueFastBall.indexOf(meId);
			if (idx !== -1) {
				return true;
			}
			return false
		}
		if (mode === 1) {
			idx = this.queueShortPad.indexOf(meId);
			if (idx !== -1) {
				return true;
			}
			return false;
		}
		return false;
	};

	getUsersOffQueues(u1: number, u2: number) {
		var idx = this.queue.indexOf(u1);
		var idx2 = this.queue.indexOf(u2);
		if (idx > -1) {
			this.queue.splice(idx, 1);
		}
		if (idx2 > -1) {
			this.queue.splice(idx2, 1);
		}

		idx = this.queueShortPad.indexOf(u1);
		idx2 = this.queueShortPad.indexOf(u2);
		if (idx > -1) {
			this.queueShortPad.splice(idx, 1);
		}
		if (idx2 > -1) {
			this.queueShortPad.splice(idx2, 1);
		}

		idx = this.queueFastBall.indexOf(u1);
		idx2 = this.queueFastBall.indexOf(u2);
		if (idx > -1) {
			this.queueFastBall.splice(idx, 1);
		}
		if (idx2 > -1) {
			this.queueFastBall.splice(idx2, 1);
		}
	}

	async joinQueue(userId: number, mode: number) {
		if (mode === 1) {
			this.queueShortPad.push(userId);
			return this.queueShortPad;
		}
		else if (mode === 2) {
			this.queueFastBall.push(userId);
			return this.queueFastBall;
		}
		else {
			this.queue.push(userId);
		}
		return this.queue;
	}


	async createLobby(userId1: number, userId2: number, mode: number) {
		const lobby = new Lobby();
		lobby.PlayersId.push(userId1);
		lobby.PlayersId.push(userId2);
		lobby.PalettePlayer1 = userId1;
		lobby.PalettePlayer2 = userId2;
		lobby.mode = mode;

		this.lobbies.set(lobby.LobbyId, lobby);
		return lobby.LobbyId;
	}

	async findUserInLobby(userId: number): Promise<boolean> {
		for (const l of this.lobbies.values()) {
			var ret = l.PlayersId.find(e => e === userId);
			if (ret) {
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
			var ret2 = l.ViewersId.find(e => e === userId);
			if (ret2) {
				return l.LobbyId;
			}
		}
		return undefined;
	}

	async specLobby(lobbyId: number, meId: number) {
		console.log(`user ${meId} want to spec lobby ${lobbyId}`);
		const lobby = this.lobbies.get(lobbyId);
		if (!lobby) {
			return; // no lobby here
		}
		if (lobby.ViewersId.find(user => user === meId)) {
			return; // already a viewer
		}
		lobby.ViewersId.push(meId);
		this.socket.specLobby(meId, lobbyId);

	}


	async specUser(meId: number, targetId: number) {

		//        let roomId :string = await this.socket.lobbyUserInGame(targetId);
		let roomId = await this.findUserInLobbies(targetId);

		if (roomId !== undefined) {
			let looby = this.lobbies.get(roomId);
			if (looby !== undefined) {
				looby.ViewersId.push(meId);
				this.socket.specLobby(meId, roomId);
				this.lstViewer(looby.LobbyId)
			}
		}
	}

    async inviteToLobby(meId:number, targetId: number) {


       	if (this.socket.isUserAvailable(meId) && this.socket.isUserAvailable(targetId)) {
        if ((await this.relation.is_block(targetId, meId)) === true){
            return false;
        }
	 	const lobbyId = await this.createLobby(meId, targetId, 0);
	 	this.socket.joinGameRoom(meId, lobbyId);
	 	this.socket.joinGameRoom(targetId, lobbyId);
		this.socket.wss.to("game" + lobbyId).emit('mouveToGame', {lobbyId: lobbyId});
		// this.goJohnny(meId, targetId, lobbyId)
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
			return; // no lobby here
		}
		var idx = lobby.ViewersId.indexOf(userId);
		if (idx !== -1) {
			lobby.ViewersId.splice(idx, 1);
		}
	}

	async leaveLobby(meId: number) {
		let lobbyId = await this.findUserInLobbies(meId);

		if (lobbyId === undefined)
			return;
		let lobby = this.lobbies.get(lobbyId);
		if (lobby.PalettePlayer1 === meId || lobby.PalettePlayer2 === meId) {
			this.clearLobby(lobbyId);
			this.socket.closeRoom(lobby.LobbyId);
			// make all player leave socket room
		}
		const idx = (lobby.ViewersId.indexOf(meId))
		if (idx !== -1)
			lobby.ViewersId.splice(idx, 1);

		// exit viewer du lobby
	}

	async quitQueue(meId: number) {
		let idx: number;
		idx = this.queue.indexOf(meId);
		if (idx !== -1) {
			this.queue.pop();
		}
		idx = this.queueFastBall.indexOf(meId);
		if (idx !== -1) {
			this.queueFastBall.pop()
		}
		idx = this.queueShortPad.indexOf(meId);
		if (idx !== -1) {
			this.queueShortPad.pop();
		}

	}

	async clearLobby(lobbyId: number) {
		this.lobbies.delete(lobbyId);
	}

	async cleanLobbyMap() {
		this.lobbies.clear();
	}
}