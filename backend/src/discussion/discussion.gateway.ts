import { Logger, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtGuard } from 'src/auth/guard';
import { DiscussionMessageService } from 'src/discussion-message/discussion-message.service';
import { DiscussionMessageDto } from 'src/discussion-message/dto/discussion-message.dto';
import { DiscussionService } from './discussion.service';

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
      this.joinDiscRoom(client, discussion.id);
    }
  }

  //////////////
  //  EVENTS  //
  //////////////
  @SubscribeMessage('loginToServer')
  async handleLogin(client: Socket, userId: number) {
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
