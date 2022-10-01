import { Module } from "@nestjs/common";
import { AchivmentService } from "src/achiv/achiv.service";
import { RelationController } from "./relation.controller";
import { RelationService } from "./relation.service";

@Module({
	imports: [],
	controllers: [RelationController],
	providers: [RelationService,
		AchivmentService]
})

export class RelationModule {}