import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class ChannelPasswordDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(3)
    password?: string;

}