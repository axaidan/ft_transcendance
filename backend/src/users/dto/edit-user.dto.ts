import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from "class-validator"

export class EditUserDto {
    
    // !!! TO TAKE OUT, EMAIL NOT EDITABLE
    // EMAIL EDITING TESTS TO BE REMOVED TOO
    // @IsEmail()
    // @IsOptional()
    // @MaxLength(320) // OFFICIAL EMAIL ADDRESS MAX LENGTH
    // email?: string;

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