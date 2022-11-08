import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, MinLength, ValidateIf } from "class-validator";
import { EChannelTypes } from "../types/channel-types.enum";

export class EditChannelDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(3)
    name?: string;

    @IsOptional()
    @Min(0)
    @Max(2)
    type?: number;

    // @IsOptional()
    @ValidateIf(o => o.type === EChannelTypes.PROTECTED)
    @IsString()
    @IsNotEmpty()
    hash?: string;

}