import { IsInt, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ChannelDto {

    @IsInt()
    id: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(3)
    hash?: string;

}