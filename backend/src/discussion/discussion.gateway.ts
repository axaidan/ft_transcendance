import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DiscussionMessageService } from 'src/discussion-message/discussion-message.service';
import { DiscussionMessageDto } from 'src/discussion-message/dto/discussion-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DiscussionService } from './discussion.service';
import { DiscussionDto } from './dto';

@WebSocketGateway({ cors: '*:*', namespace: 'discussionNs' })
export class DiscussionGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private discService: DiscussionService,
    private discMsgService: DiscussionMessageService,
  ) {}

  @WebSocketServer() wss: Server;
  private logger: Logger = new Logger('DiscussionGateway');

  afterInit(server: Server) {
    this.logger.log('Initialized')
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`CLIENT ${client.id} CONNECTED`);
  }


  handleDisconnect(client: Socket) {
    this.logger.log(`CLIENT ${client.id} DISCONNECTED`);
  }


  @SubscribeMessage('discMsgToServer')
  handleDiscMsg(client: Socket, dto: DiscussionMessageDto): void {
    const room = `disc${dto.discId}`;
    this.wss.to(room).emit('discMsgToclient', dto);
    this.discMsgService.create(dto);
  }

  @SubscribeMessage('loginToServer')
  handleLoginMsg(client: Socket, userId: number): void {
    this.logger.log(`USER ${userId} LOGGED IN`);
  }

  @SubscribeMessage('logoutToServer')
  handleLogout(client: Socket, userId: number): void {
    this.logger.log(`USER ${userId} LOGGED OUT`);
    client.broadcast.emit('logoutToClient', userId);
  }

  @SubscribeMessage('joinDiscRoom')
  handleJoinDiscRoom(client: Socket, discId: number) {
    const room: string = 'disc' + discId;
    client.join(room);
  }

  // @SubscribeMessage('joinDiscToServer')
  // handleJoinDisc(client: Socket, dto: DiscussionDto) {
    
  // }
}
