import { Module } from "@nestjs/common";
import { AchivModule } from "src/achiv/achiv.module";
import { AchievementService } from "src/achiv/achiv.service";
import { JwtGuard } from "src/auth/guard";
import { FtStrategy } from "src/auth/strategie";
import { RelationController } from "./relation.controller";
import { RelationService } from "./relation.service";

@Module({
	imports: [
		AchivModule
	],
	controllers: [
		RelationController
	],
	providers: [
		RelationService,
		AchievementService, 
		FtStrategy,
		JwtGuard
	],
	exports: [
		RelationService,
		AchievementService,
	],
})

export class RelationModule {}