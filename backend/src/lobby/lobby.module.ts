import { Module } from "@nestjs/common";
import { AppGateway } from "src/app.gateway";
import { AppModule } from "src/app.module";
import { JwtGuard } from "src/auth/guard";
import { GameService } from "src/game/game.service";
import { lobbyController } from "./lobby.controller";
import { LobbyService } from "./lobby.service";

@Module({
    imports: [],
    controllers: [lobbyController],
    providers: [LobbyService, JwtGuard, AppGateway, GameService]
})

export class LobbyModule{}