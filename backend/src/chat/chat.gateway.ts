import { forwardRef, Inject, Logger, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtGuard } from 'src/auth/guard';
import { DiscussionMessageDto } from 'src/chat/discussion-message/dto/discussion-message.dto';
import { DiscussionService } from './discussion/discussion.service';
import { DiscussionDto } from './discussion/dto/discussion.dto';

@WebSocketGateway({ cors: '*:*', namespace: 'chatNs' })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        @Inject(forwardRef(() => DiscussionService))
        private discService: DiscussionService,
    ) { }

    @WebSocketServer() wss: Server;
    private logger: Logger = new Logger('ChatGateway');
    private clientsMap = new Map<number, Socket>();

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
        for (const [id, value] of this.clientsMap) {
            if (client.id === value.id) {
                this.logger.log(`USER ${id} LOGGED OUT`);
                this.wss.emit('logoutToClient', id);
                this.clientsMap.delete(id);
                break;
            }
        }
        this.displayClientsMap();
    }

    //////////////
    //  METHODS //
    //////////////
    joinDiscRoom(userId: number, discId: number) {
        if (this.clientsMap.has(userId)) {
            const client: Socket = this.clientsMap.get(userId);
            const roomName: string = 'disc' + discId;
            if ((roomName in client.rooms) === false) {
                this.logger.log(`USER ${userId} JOINING '${roomName}' ROOM`);
                client.join(roomName);
            }
        }
    }

    async joinAllDiscRooms(userId: number) {
        const discussions = await this.discService.getDiscussionsIds(userId);
        for (const discussion of discussions) {
            this.joinDiscRoom(userId, discussion.id);
        }
    }

    newDisc(dto: DiscussionDto) {
        const roomName: string = 'disc' + dto.id;
        this.wss.to(roomName).emit('newDiscToClient', dto);
    }

    displayClientsMap() {
        for (const [key, value] of this.clientsMap) {
            this.logger.log(`\tclientsMap[${key}]\t=\t${value.id}`);
        }
    }

    //////////////
    //  EVENTS  //
    //////////////
    @SubscribeMessage('loginToServer')
    async handleLogin(client: Socket, userId: number) {
        if (this.clientsMap.has(userId)) {
            this.logger.error(`USER ${userId} ALREADY LOGGED IN`);
            // client.disconnect(true);
            throw new WsException(`double connection`);
        }
        this.logger.log(`USER ${userId} LOGGED IN`);
        this.clientsMap.set(userId, client);
        this.displayClientsMap();
        await this.joinAllDiscRooms(userId);
    }

    @SubscribeMessage('logoutToServer')
    handleLogout(
        client: Socket,
        userId: number
        ) :
    void
    {
        this.logger.log(`USER ${userId} LOGGED OUT`);
        client.broadcast.emit('logoutToClient', userId);
    }

    @SubscribeMessage('discMsgToServer')
    async handleDiscMsg(
        client: Socket,
        dto: DiscussionMessageDto):
    Promise<void>
    {
        this.logger.log(`RECEIVED\t'${dto.text.substring(0, 10)}' FROM USER ${dto.userId}`);
        const message = await this.discService.createDiscMsg(dto);
        const roomName = `disc${dto.discId}`;
        this.wss.to(roomName).emit('discMsgToclient', message);
        this.logger.log(`EMITTED\t'${dto.text.substring(0, 10)}' TO ROOM 'disc${dto.discId}'`);
    }
}