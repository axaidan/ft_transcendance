import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: "/alertSocketNS" })
export class AlertGateway {

  private logger: Logger = new Logger('AlertGateway');

  @WebSocketServer() wss: Server;

  sendToAll(msg: string) {
    this.logger.log('sendToAll() => function called with \'' + msg + '\'')
    this.wss.emit('alertMsgToClient', { type: 'Alert', message: msg });
  }
}
