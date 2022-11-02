import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class ChannelDto {

    @IsInt()
    id: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(3)
    hash?: string;

}