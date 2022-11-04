import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, ValidateIf } from "class-validator";
import { EChannelTypes } from "../types/channel-types.enum";

export class EditChannelDto {

    // @IsInt()
    // chanId: number;
    
    @IsString()
    name?: string;

    @Min(0)
    @Max(2)
    type?: number;

    @IsOptional()
    @ValidateIf(o => o.type === EChannelTypes.PROTECTED)
    @IsString()
    @IsNotEmpty()
    hash?: string;

}