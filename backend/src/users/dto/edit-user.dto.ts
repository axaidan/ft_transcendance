import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator"

export class EditUserDto {
    
    @IsEmail()
    @IsOptional()
    @MaxLength(320) // OFFICIAL EMAIL ADDRESS MAX LENGTH
    email?: string;

    @ValidateIf(username => username === '')
    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(20)
    username?: string;

    @IsBoolean()
    @IsOptional()
    twoFactorAuth?: boolean;

}