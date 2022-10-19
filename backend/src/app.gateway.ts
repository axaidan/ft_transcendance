import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnlineStatusDto } from './users/dto';

@WebSocketGateway({ cors: '*:*' })
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	// constructor(
	// 	// @Inject(forwardRef(() => UserService))
	// 	private userService: UserService,
	// ) { }

	@WebSocketServer() wss: Server;

	private logger: Logger = new Logger('AppGateway');
	private clientsMap = new Map<number, string>();

	////////////////////////////////////
	//  INIT, CONNECTION, DISCONNECT  //
	////////////////////////////////////
	afterInit(server: Server) {
		// this.logger.log('Initialized');
	}

	// @UseGuards(JwtGuard)
	handleConnection(client: Socket, ...args: any[]) {
		// this.logger.log(`CLIENT ${client.id} CONNECTED`);
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`CLIENT ${client.id} DISCONNECTED`);
		for (const [id, value] of this.clientsMap) {
			if (client.id === value) {
				// this.logger.log(`USER ${id} LOGGED OUT`);
				this.wss.emit('logoutToClient', id);
				this.clientsMap.delete(id);
				break;
			}
		}
		// this.dispayClientsMap();
	}

	//////////////
	//  METHODS //
	//////////////
	dispayClientsMap() {
		this.logger.log('=== number of clients = ' + this.wss.engine.clientsCount)
		for (const [key, value] of this.clientsMap) {
			this.logger.log(`\tuserService.wsMap[${key}]\t=\t${value}`);
		}
	}

	//////////////
	//  EVENTS  //
	//////////////
	@SubscribeMessage('loginToServer')
	handleLogin(client: Socket, userId: number) {
		if (this.clientsMap.has(userId)) {
			this.logger.error(`USER ${userId} ALREADY LOGGED IN`);
			throw new WsException(`double connection`);
		}
		this.clientsMap.set(userId, client.id);
		this.logger.log(`USER ${userId} LOGGED IN`);
		client.broadcast.emit('loginToClient', userId);
		this.dispayClientsMap();
	}

	@SubscribeMessage('logoutToServer')
	handleLogout(client: Socket, userId: number) {
		this.logger.log(`USER ${userId} LOGGED OUT`);
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
		this.logger.log('userIdArr: ' + userIdArr);
		client.emit('getOnlineUsersToClient', userIdArr);
	}

}