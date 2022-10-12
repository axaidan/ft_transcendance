import { Module } from "@nestjs/common";
import { RelationController } from "./relation.controller";
import { RelationService } from "./relation.service";
import { FtStrategy } from '../auth/strategie/ft.strategie';
import { AchievementService } from '../achiv/achiv.service';
import { JwtGuard } from '../auth/guard/jwt.guard';

@Module({
	imports: [],
	controllers: [RelationController],
	providers: [RelationService,
		AchievementService,
		FtStrategy,
		JwtGuard]
})

export class RelationModule { }