import { Module } from "@nestjs/common";
import { AchievementService } from "src/achiv/achiv.service";
import { AppGateway } from "src/app.gateway";
import { AppModule } from "src/app.module";
import { JwtGuard } from "src/auth/guard";
import { GameService } from "src/game/game.service";
import { RelationModule } from "src/relations/relation.module";
import { RelationService } from "src/relations/relation.service";
import { lobbyController } from "./lobby.controller";
import { LobbyService } from "./lobby.service";

@Module({
    imports: [RelationModule],
    controllers: [lobbyController],
    providers: [LobbyService, JwtGuard, AppGateway, GameService, ],
})

export class LobbyModule{}