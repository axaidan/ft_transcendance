import { Module } from "@nestjs/common";
import { AchivController } from "./achiv.controller";
import { AchivmentService } from "./achiv.service";

@Module({
	imports: [],
	controllers: [AchivController],
	providers: [AchivmentService],

})
export class AchivModule{}