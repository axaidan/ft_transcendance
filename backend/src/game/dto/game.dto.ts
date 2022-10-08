import { IsNotEmpty, IsNumber} from "class-validator";

export class CreateGameDto {
    @IsNotEmpty()
    @IsNumber()
    userId1: number;

    @IsNotEmpty()
    @IsNumber()
    score1: number;

    @IsNotEmpty()
    @IsNumber()
    userId2: number;
    
    @IsNotEmpty()
    @IsNumber()
    score2: number;
}

export class HistoriqueDto {
	@IsNotEmpty()
	@IsNumber()
	userId: number;

}