import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnlineStatusDto } from './users/dto';

@WebSocketGateway({ cors: '*:*', })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	// constructor(
	// 	// @Inject(forwardRef(() => UserService))
	// 	private userService: UserService,
	// ) { }

	@WebSocketServer() wss: Server;

	private logger: Logger = new Logger('AppGateway');
	private clientsMap = new Map<number, Socket>(); // userid / socket associer au user
	private statusMap = new Map<number, number>();  // userid / statusId
	private clientsMapRooms = new Map<string, Set<number>>();  // map de RoomName ArrayUserId


	////////////////////////////////////
	//  INIT, CONNECTION, DISCONNECT  //
	////////////////////////////////////
	afterInit(server: Server) {
		this.logger.log('Initialized');
	}

	// @UseGuards(JwtGuard)
	handleConnection(client: Socket, ...args: any[]) {
		 this.logger.log(`CLIENT ${client.id} CONNECTED: app.gateway`);
		client.broadcast.emit('loginToClient', client.id);

	}

	handleDisconnect(client: Socket) {
		this.logger.log(`CLIENT ${client.id} DISCONNECTED app.gateway`);
		for (const [id, value] of this.clientsMap) {
			if (client.id === value.id) {
				this.logger.log(`USER ${id} LOGGED OUT app.gateway`);
				this.wss.emit('logoutToClient', id);
				this.clientsMap.delete(id);
				this.exitRoom(id, client);
				break;
			}
		}
		this.dispayClientsMap();
	}



	@SubscribeMessage('ChangeStatusToServer')
	changeStatus(client: Socket, data: any) {
		this.logger.log(`CLIENT ${client.id} Change status`);
		this.statusMap.delete(data.userId);
		this.statusMap.set( data.userId, data.status );
		client.broadcast.emit('ChangeStatusToClient', data);
	}

	//////////////
	//  METHODS //
	//////////////
	dispayClientsMap() {
		this.logger.log('=== number of clients = ' + this.wss.engine.clientsCount)
		for (const [key, value] of this.clientsMap) {
			this.logger.log(`\tclientsMap[${key}]\t=\t${value}`);
		}
	}

	//////////////
	//  EVENTS  //
	//////////////
	@SubscribeMessage('loginToServer')
	handleLogin(client: Socket, userId: number) {
		if (this.clientsMap.has(userId)) {
			this.logger.error(`USER ${userId} ALREADY LOGGED IN appGateway`);
			throw new WsException(`double connection`);
		}
		this.clientsMap.set(userId, client);
		this.statusMap.set(userId, 0);
		this.logger.log(`USER ${userId} LOGGED IN appgateway`);

		

		client.broadcast.emit('loginToClient', { userId:userId, status:this.statusMap.get(userId)});
		this.dispayClientsMap();
	}

	@SubscribeMessage('logoutToServer')
	handleLogout(client: Socket, userId: number) {
		this.logger.log(`USER ${userId} LOGGED OUT appGateway`);
		client.broadcast.emit('logoutToClient', userId);
		this.clientsMap.delete(userId);
		this.statusMap.delete(userId);
	}

	/*  PASS A userId, 
		RETURNS TRUE IF THIS USER HAS A WEBSOCKET OPEN
	*/
	@SubscribeMessage('isOnlineToServer')
	handleIsOnline(client: Socket, userId: number): WsResponse<OnlineStatusDto> {
		if (this.clientsMap.has(userId)) {
			return {
				event: 'isOnlineToClient', data: {
					userId: userId,
					onlineStatus: true,
				}
			};
		}
		else {
			return {
				event: 'isOnlineToClient', data: {
					userId: userId,
					onlineStatus: false,
				}
			};
		}
	}

	@SubscribeMessage('getOnlineUsersToServer')
	handleGetOnlineUsers(client: Socket) {
		const userIdArr: { userId: number, status: number }[] = [];
		for (const user of this.statusMap) {
			userIdArr.push({ userId: user[0], status: user[1] });
		}
		client.emit('getOnlineUsersToClient', userIdArr);
	}

	/** 
	 * room pour le jeu commance
	 * */

	/**
	 * 
	 * @param userId user
	 * @param lobbieId room to join
	 */

	joinGameRoom(userId: number, lobbieId: number) {
		this.logger.log('joinGameRoom');
		this.logger.log(`id du joins : ${userId}`)
		if (this.clientsMap.has(userId)) {
			this.logger.log('joinGameRoom client exist');
			const client: Socket = this.clientsMap.get(userId);
			const roomName: string = 'game' + lobbieId;
			if ((roomName in client.rooms) === false) {
				this.logger.log(`User ${userId} Joining ${roomName} room`);
				client.join(roomName);


				var listEle: Set<number> = this.clientsMapRooms.get(roomName);

				if (listEle) {

					var indexEle = listEle.has(userId)
					if (indexEle) {
					}
					else {
						listEle.add(userId);
					}
				}
				else {
					let lst: Set<number> = new Set<number>()
					lst.add(userId)
					this.clientsMapRooms.set(roomName, lst)

				}
			}
		}
		else {
			this.logger.log('client exist pas')
		}
	}

	specLobby(meId: number, lobbyId: number) {
		let roomName: string = 'game' + lobbyId;
		if (this.clientsMapRooms.has(roomName)) {
			this.clientsMapRooms.get(roomName).add(meId);
		}
	}

	async closeRoom(lobbieId: number) {
		let roomName: string = 'game' + lobbieId;

		console.log(`go close room: ${roomName}`)
		this.clientsMapRooms.forEach((object, roomName) => {
			object.forEach((inc) => {
				console.log(`test :${inc}`);
				this.clientsMapRooms.get(roomName).delete(inc)
			})
		})


	}

	//------------- exit la room mais pas le views lobby !!! //
	exitGameRoom(userId: number, lobbieId: number) {
		this.logger.log('exitGameRoom');
		this.logger.log(`id du client : ${userId}`);

		var roomName: string = 'game' + lobbieId;
		if (this.clientsMap.has(userId)) {
			let listEle: Set<number> = this.clientsMapRooms.get(roomName)

			if (listEle !== undefined) {
				//remove element oflist ele
				let Ele = listEle.has(userId);
				if (Ele) {
					console.log(`element : ${userId} exit the game room`)
					listEle.delete(userId);
					this.clientsMap.get(userId).leave(roomName);
				}
				else {
					console.log(`element : ${userId} exist pas`)
				}
			}
			else {
				console.log(`room doesnt exit: ${roomName} `);
			}
		}
		else {
			this.logger.log('client exist pas');
		}

	}

	watchUsersInRoom(lobbieId: number) {
		var roomName: string = 'game' + lobbieId;

		let listEle: Set<number> = this.clientsMapRooms.get(roomName)


		if (listEle) {
			//remove element oflist ele
			let Ele = listEle.forEach((object) => {
				console.log(`userId in rooms ${object}`);
			})

		}
		else {
			console.log('room doesnt exit');
		}
	}

	exitRoom(userId: number, client: Socket) {
		this.clientsMapRooms.forEach((arr, roomName) => {
			if (arr.delete(userId)) {
				client.leave(roomName);
				console.log(`user ${userId} exit the room`)
			}

		})
	}

	async lobbyUserInGame(userId: number): Promise<string> {
		this.clientsMapRooms.forEach((arr, roomName) => {
			arr.has(userId);
			return roomName;
		})
		return null
	}

	startGame(userId1: number, userId2: number, lobbyId: number){
		console.log('test emitions ')
		console.log(`emit to game + ${lobbyId}`);
        this.wss.to('game' + lobbyId).emit("startGame", {p1: userId1 , p2:userId2 , lobbyId:lobbyId, mode: 1});
	}

	@SubscribeMessage('printscore')
	editScore(@ConnectedSocket() socket: Socket, @MessageBody() body:string) {
		const b: string[] = body.split(':');

		console.log(`score edit: room ${b[0]} score1 : ${b[1]} score2: ${b[2]}`)
/*		if (parseInt(b[1]) >= 5 || parseInt(b[2]) >= 5) {
			this.wss.to(b[0]).emit("endGame", parseInt(b[1]), parseInt(b[2]))
		}*/
			this.wss.to(b[0]).emit("updateScore", parseInt(b[1]), parseInt(b[2]));
	}

	@SubscribeMessage('updateGame')
	async updateGame(@ConnectedSocket() socket: Socket, @MessageBody() body : string){
		const b: string[] = body.toString().split(':');

	//	console.log('test socket bacj')

//		console.log(`lobbynamne: ${b[4]}, pos1: ${b[0]}, pos2: ${b[1]} ballx: ${b[2]} y: ${b[3]}}`)
		this.wss.to(b[4]).emit("updatePos", Number(b[0]), Number(b[1]) ,Number(b[2]) , Number(b[3]));
	}

	@SubscribeMessage('padUpdate')
	async padUpdate(@ConnectedSocket() socket: Socket, @MessageBody() body: string) {
		const b: string[] = body.toString().split(':');
		
		this.wss.to(b[0]).emit("padUpdat", Number(b[1]), Number(b[2]));
	}

	@SubscribeMessage('updateBall')
	async ballUpdate(@ConnectedSocket() socket: Socket, @MessageBody() body: string) {
		const b: string[] = body.toString().split(':');

	//	console.log(b)
		this.wss.to(b[0]).emit('updatBall', Number(b[1]), Number(b[2]), Number(b[3]), Number(b[4]));
	}

	@SubscribeMessage('end')
	async end(@ConnectedSocket() socket: Socket, @MessageBody() body: string) {
		const b: string[] = body.toString().split(':');

		this.wss.to(b[0]).emit('end', parseInt(b[1]), parseInt(b[2]));
	}

}