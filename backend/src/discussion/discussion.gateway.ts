import { Logger, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtGuard } from 'src/auth/guard';
import { DiscussionMessageService } from 'src/discussion-message/discussion-message.service';
import { DiscussionMessageDto } from 'src/discussion-message/dto/discussion-message.dto';
import { DiscussionService, DiscussionWithUsers } from './discussion.service';

@WebSocketGateway({ cors: '*:*', namespace: 'chatNs' })
export class DiscussionGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private discService: DiscussionService,
    private discMsgService: DiscussionMessageService,
  ) {}

  @WebSocketServer()  wss: Server;
  private             logger: Logger = new Logger('DiscussionGateway');

  ////////////////////////////////
  //  INIT, CONNECT, DISCONNECT //
  ////////////////////////////////
  afterInit(server: Server) {
    this.logger.log('Initialized')
  }

  @UseGuards(JwtGuard)
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`CLIENT ${client.id} CONNECTED`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`CLIENT ${client.id} DISCONNECTED`);
    for (const [id, value] of this.discService.wsMap) {
      if (client.id === value) {
        this.logger.log(`USER ${id} LOGGED OUT`);
        this.wss.emit('logoutToClient', id);
        this.discService.wsMap.delete(id);
        break ;
      }
    }
  }

  //////////////
  //  METHODS //
  //////////////
  joinDiscRoom(client: Socket, discId: number) {
    const room: string = 'disc' + discId;
    client.join(room);
  }

  async joinAllDiscRooms(client: Socket, userId: number) {
    const discussions = await this.discService.getDiscussions(userId);
    for (const discussion of discussions) {
      this.logger.log(`USER ${userId} JOINING ${discussion.id} ROOM`);
      this.joinDiscRoom(client, discussion.id);
    }
  }

  newDisc(client: Socket, discussion: DiscussionWithUsers) {
    client.emit('newDiscToClient', discussion);
  }

  //////////////
  //  EVENTS  //
  //////////////
  @SubscribeMessage('loginToServer')
  async handleLogin(client: Socket, userId: number) {
    this.logger.log(`USER ${userId} LOGGED IN`);
    this.discService.wsMap.set(userId, client.id);
    if (this.discService.wsMap[userId]) {
      this.logger.error(`USER ${userId} ALREADY LOGGED IN`);
      throw new WsException(`double connection`);
    }
    this.discService.wsMap.set(userId, client.id);
    this.logger.log(`USER ${userId} LOGGED IN`);
    await this.joinAllDiscRooms(client, userId);
  }

  @SubscribeMessage('logoutToServer')
  handleLogout(client: Socket, userId: number): void {
    this.logger.log(`USER ${userId} LOGGED OUT`);
    client.broadcast.emit('logoutToClient', userId);
  }

  @SubscribeMessage('discMsgToServer')
  handleDiscMsg(client: Socket, dto: DiscussionMessageDto): void {
    const room = `disc${dto.discId}`;
    this.wss.to(room).emit('discMsgToclient', dto);
    this.discMsgService.create(dto);
  }
  
}
