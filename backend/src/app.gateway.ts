import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnlineStatusDto } from './users/dto';

@WebSocketGateway({ cors: '*:*',  })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	// constructor(
	// 	// @Inject(forwardRef(() => UserService))
	// 	private userService: UserService,
	// ) { }

	@WebSocketServer() wss: Server;

	private logger: Logger = new Logger('AppGateway');
	private clientsMap = new Map<number, Socket>();

	////////////////////////////////////
	//  INIT, CONNECTION, DISCONNECT  //
	////////////////////////////////////
	afterInit(server: Server) {
		 this.logger.log('Initialized');
	}

	// @UseGuards(JwtGuard)
	handleConnection(client: Socket, ...args: any[]) {
		 this.logger.log(`CLIENT ${client.id} CONNECTED: app.gateway`);
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`CLIENT ${client.id} DISCONNECTED app.gateway`);
		for (const [id, value] of this.clientsMap) {
			if (client.id === value.id) {
				 this.logger.log(`USER ${id} LOGGED OUT app.gateway`);
				this.wss.emit('logoutToClient', id);
				this.clientsMap.delete(id);
				break;
			}
		}
		this.dispayClientsMap();
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
		 this.logger.log(`USER ${userId} LOGGED IN appgateway`);
		client.broadcast.emit('loginToClient', userId);
		 this.dispayClientsMap();
	}

	@SubscribeMessage('logoutToServer')
	handleLogout(client: Socket, userId: number) {
		this.logger.log(`USER ${userId} LOGGED OUT appGateway`);
		client.broadcast.emit('logoutToClient', userId);
		this.clientsMap.delete(userId);
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
		const userIdArr: number[] = [];
		for (const userId of this.clientsMap.keys()) {
			userIdArr.push(userId);
		}
		client.emit('getOnlineUsersToClient', userIdArr);
	}

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
			}
		}
		else {
			this.logger.log('client edxist pas')
		}
	}

}