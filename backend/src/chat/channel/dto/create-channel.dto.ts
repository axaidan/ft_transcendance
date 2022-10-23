import { ValidationPipe } from "@nestjs/common";
import { IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength, ValidateIf } from "class-validator";

export class CreateChannelDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(3)
    name: string;

    @IsBoolean()
    private: boolean;

    @ValidateIf(o => o.private === true) 
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(3)
    hash?: string;

}