import { IsNotEmpty, IsString } from "class-validator";

export class TargetDto {
	@IsNotEmpty()
	@IsString()
	userId: string;
}