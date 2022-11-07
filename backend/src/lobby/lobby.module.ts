import { Module } from "@nestjs/common";
import { AppGateway } from "src/app.gateway";
import { JwtGuard } from "src/auth/guard";
import { lobbyController } from "./lobby.controller";
import { LobbyService } from "./lobby.service";

@Module({
    imports: [],
    controllers: [lobbyController],
    providers: [LobbyService, JwtGuard, AppGateway]
})

export class LobbyModule{}