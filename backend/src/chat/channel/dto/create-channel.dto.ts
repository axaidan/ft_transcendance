import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";

export class CreateChannelDto {

    @IsString()
    name: string;

    @IsBoolean()
    private: boolean;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @ValidateIf(o => o.private === true) 
    hash: string;

}