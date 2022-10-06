import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TargetDto {
	@IsNotEmpty()
	@IsNumber()
	userId: number;
}