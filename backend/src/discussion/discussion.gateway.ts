import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: '*:*', namespace: 'discussionNs' })
export class DiscussionGateway /*implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect*/ {

  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('DiscussionGateway');

  // afterInit(server: Server) {
  //   this.logger.log('Initialized')
  // }

  // handleConnection(client: Socket, ...args: any[]) {
  //   this.logger.log(`Client ${client.id} CONNECTED`)
  // }

  // handleDisconnect(client: Socket) {
  //   this.logger.log(`Client ${client.id} DISCONNECTED`)
  // }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): string {
    return 'Hello world!';
  }
}
