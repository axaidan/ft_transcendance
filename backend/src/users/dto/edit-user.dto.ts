import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator"

export class EditUserDto {
    
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    username?: string;

    @IsBoolean()
    @IsOptional()
    twoFactorAuth?: boolean;

}