import { IsNotEmpty, IsNumber } from "class-validator";

export class AchivDto {
	@IsNotEmpty()
	title: string;

	descriptions: string;
	

}

export class LinkDto {
	@IsNumber()
	userId: string;

	@IsNumber()
	achivId: string;
}