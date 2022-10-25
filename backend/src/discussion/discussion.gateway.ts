import { forwardRef, Inject, Logger, UseGuards } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtGuard } from 'src/auth/guard';
import { DiscussionMessageService } from 'src/discussion-message/discussion-message.service';
import { DiscussionMessageDto } from 'src/discussion-message/dto/discussion-message.dto';
import { DiscussionService, DiscussionWithUsers } from './discussion.service';

@WebSocketGateway({ cors: '*:*', namespace: 'chatNs' })
export class DiscussionGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		@Inject(forwardRef(() => DiscussionService))
		private discService: DiscussionService,
		private discMsgService: DiscussionMessageService,
	) { }

	@WebSocketServer() wss: Server;
	private logger: Logger = new Logger('DiscussionGateway');

	////////////////////////////////
	//  INIT, CONNECT, DISCONNECT //
	////////////////////////////////
	afterInit(server: Server) {
		this.logger.log('Initialized')
	}

	@UseGuards(JwtGuard)
	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`CLIENT ${client.id} CONNECTED`);
		this.displayClientsMap();
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`CLIENT ${client.id} DISCONNECTED`);
		for (const [id, value] of this.discService.wsMap) {
			if (client.id === value.id) {
				this.logger.log(`USER ${id} LOGGED OUT`);
				this.wss.emit('logoutToClient', id);
				this.discService.wsMap.delete(id);
				break;
			}
		}
		this.displayClientsMap();
	}
	//////////////
	//  METHODS //
	//////////////
	joinDiscRoom(client: Socket, discId: number, /*DBG*/userId: number) {
		const roomName: string = 'disc' + discId;
		this.logger.log(`USER ${userId} JOINING 'disc${discId}' ROOM`);
		client.join(roomName);
	}

	async joinAllDiscRooms(client: Socket, userId: number) {
		const discussions = await this.discService.getDiscussions(userId);
		for (const discussion of discussions) {
			this.joinDiscRoom(client, discussion.id, /*DBG*/userId);
		}
	}

	newDisc(client: Socket, discussion: DiscussionWithUsers, /*DBG*/userId: number) {
		this.logger.log(`EMIT('newDiscToClient') TO USER ${userId} FOR NEW 'disc${discussion.id}' ROOM`);
		client.emit('newDiscToClient', discussion);
	}

	displayClientsMap() {
		for (const [key, value] of this.discService.wsMap) {
			this.logger.log(`\twsMap[${key}]\t=\t${value.id}`);
		}
	}


	//////////////
	//  EVENTS  //
	//////////////
	@SubscribeMessage('loginToServer')
	async handleLogin(client: Socket, userId: number) {
		if (this.discService.wsMap.has(userId)) {
			this.logger.error(`USER ${userId} ALREADY LOGGED IN`);
			client.disconnect(true);
			throw new WsException(`double connection`);
		}
		this.discService.wsMap.set(userId, client);
		this.logger.log(`USER ${userId} LOGGED IN`);
		await this.joinAllDiscRooms(client, userId);
		this.displayClientsMap();
	}

	@SubscribeMessage('logoutToServer')
	handleLogout(client: Socket, userId: number): void {
		this.logger.log(`USER ${userId} LOGGED OUT`);
		client.broadcast.emit('logoutToClient', userId);
	}

	@SubscribeMessage('discMsgToServer')
	handleDiscMsg(client: Socket, dto: DiscussionMessageDto): void {
		const roomName = `disc${dto.discId}`;
		this.logger.log(`RECEIVED\t'${dto.text.substring(0, 10)}' FROM USER ${dto.userId}`);
		this.wss.to(roomName).emit('discMsgToclient', dto);
		this.logger.log(`EMITTED\t'${dto.text.substring(0, 10)}' TO ROOM 'disc${dto.discId}'`);
		this.discMsgService.create(dto);
	}

}