import { Module } from "@nestjs/common";
import { AchievementService } from "src/achiv/achiv.service";
import { JwtGuard } from "src/auth/guard";
import { FtStrategy } from "src/auth/strategie";
import { RelationController } from "./relation.controller";
import { RelationService } from "./relation.service";

@Module({
	imports: [],
	controllers: [RelationController],
	providers: [RelationService,
		AchievementService, 
	FtStrategy,
	JwtGuard]
})

export class RelationModule {}