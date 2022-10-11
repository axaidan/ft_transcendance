import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: '*:*'})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('AppGateway');
  private clients = new Map();

  afterInit(server: Server) {
    this.logger.log('Initialized')
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`a client connected`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`a client disconnected`);
  }

  // @SubscribeMessage('message')
  // handleMessage(client: Socket, payload: any): string {
  //   return 'Hello world!';
  // }

  @SubscribeMessage('loginToServer')
  handleLogin(client: Socket, userId: number) {
    this.logger.log(`user ${userId} CONNECTED`);
    this.clients[userId] = client.id;
    client.broadcast.emit('loginToClient', userId);
  }

  @SubscribeMessage('logoutToServer')
  handleLogout(client: Socket, userId: number) {
    this.logger.log(`user ${userId} DISCONNECTED`);
    client.broadcast.emit('logoutToClient', userId);
  }
}

