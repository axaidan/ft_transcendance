import { Module } from "@nestjs/common";
import { AchivController } from "./achiv.controller";
import { AchievementService } from "./achiv.service";

@Module({
	imports: [],
	controllers: [AchivController],
	providers: [AchievementService],

})
export class AchivModule{}