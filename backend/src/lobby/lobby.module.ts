import { Module } from "@nestjs/common";
import { JwtGuard } from "src/auth/guard";
import { lobbyController } from "./lobby.controller";
import { LobbyService } from "./lobby.service";

@Module({
    imports: [],
    controllers: [lobbyController],
    providers: [LobbyService, JwtGuard]
})

export class LobbyModule{}