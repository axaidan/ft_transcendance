import { Logger, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtGuard } from './auth/guard';

@WebSocketGateway({ cors: '*:*'})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('AppGateway');
  private clients = new Map();

  afterInit(server: Server) {
    this.logger.log('Initialized')
  }

  @UseGuards(JwtGuard)
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`A CLIENT CONNECTED`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`A CLIENT DISCONECTED`);
  }

  // @SubscribeMessage('message')
  // handleMessage(client: Socket, payload: any): string {
  //   return 'Hello world!';
  // }

  @SubscribeMessage('loginToServer')
  handleLogin(client: Socket, userId: number) {
    if (this.clients[userId]) {
      this.logger.error(`USER ${userId} DOUBLE CONNECTION`);
      throw new WsException(`double connection`);
    }
    this.clients[userId] = client;
    this.logger.log(`USER ${userId} CONNECTED`);
    client.broadcast.emit('loginToClient', userId);
  }

  @SubscribeMessage('logoutToServer')
  handleLogout(client: Socket, userId: number) {
    this.logger.log(`USER ${userId} DISCONNECTED`);
    client.broadcast.emit('logoutToClient', userId);
  }
}