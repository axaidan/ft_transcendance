import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";

export class EditChannelDto {

    @IsInt()
    chanId: number;
    
    @IsString()
    name?: string;

    @IsBoolean()
    private?: boolean;

    @IsBoolean()
    protected?: boolean;

    @IsOptional()
    @ValidateIf(o => o.protected === true)
    // @ValidateIf(o => o.type === PROTECTED)
    @IsString()
    @IsNotEmpty()
    hash?: string;

}