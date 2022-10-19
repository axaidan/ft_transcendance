import { forwardRef, Inject, Logger, UseGuards } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Discussion } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { JwtGuard } from 'src/auth/guard';
import { DiscussionMessageService } from 'src/discussion-message/discussion-message.service';
import { DiscussionMessageDto } from 'src/discussion-message/dto/discussion-message.dto';
import internal from 'stream';
import { DiscussionService, DiscussionWithUsers } from './discussion.service';
import { DiscussionDto } from './dto/discussion.dto';

@WebSocketGateway({ cors: '*:*', namespace: 'chatNs' })
export class DiscussionGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(
        @Inject(forwardRef(() => DiscussionService))
        private discService: DiscussionService,
        private discMsgService: DiscussionMessageService,
    ) { }

    @WebSocketServer() wss: Server;
    private logger: Logger = new Logger('DiscussionGateway');
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
            const client: Socket = this.clientsMap[userId];
            const roomName: string = 'disc' + discId;
            if ((roomName in client.rooms) === false) {
                this.logger.log(`USER ${userId} JOINING '${roomName}' ROOM`);
                client.join(roomName);
            }
        }
    }

    async joinAllDiscRooms(userId: number) {
        const discussions = await this.discService.getDiscussions(userId);
        for (const discussion of discussions) {
            this.joinDiscRoom(userId, discussion.id);
        }
    }

    newDisc(discId: number) {
        const roomName: string = 'disc' + discId;
        this.wss.to(roomName).emit('newDiscToClient');
    }

    displayClientsMap() {
        for (const [key, value] of this.clientsMap) {
            this.logger.log(`\twsMap[${key}]\t=\t${value.id}`);
        }
    }

    //////////////
    //  EVENTS  //
    //////////////
    @SubscribeMessage('loginToServer')
    async handleLogin(client: Socket, userId: number) {
        if (this.clientsMap.has(userId)) {
            this.logger.error(`USER ${userId} ALREADY LOGGED IN`);
            client.disconnect(true);
            throw new WsException(`double connection`);
        }
        this.clientsMap.set(userId, client);
        this.logger.log(`USER ${userId} LOGGED IN`);
        await this.joinAllDiscRooms(userId);
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