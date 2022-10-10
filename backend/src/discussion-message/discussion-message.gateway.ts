import { Logger } from '@nestjs/common';
import { 
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
  // MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ namespace: '/discussionSocketNS' })
export class DiscMsgGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private logger: Logger = new Logger('DiscMsgGateway')

  @WebSocketServer() wss: Server;

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  
  @SubscribeMessage('discMsgToServer')
  handleMDiscessage(
    client: Socket,
    message: { sender: string, room: string, text: string }
    ) : void {
      // this.logger.log(`recv: ${ message.text }`)
      this.wss.to(message.room).emit('discMsgToClient', message);
    }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room:string) {
    client.join(room);
    client.emit('joinRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    client.emit("leftRoom", room);
  }

}
