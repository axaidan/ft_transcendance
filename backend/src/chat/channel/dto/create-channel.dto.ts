import { IsNotEmpty, IsString, Max, MaxLength, Min, MinLength, ValidateIf } from "class-validator";
import { EChannelTypes } from "../types/channel-types.enum";

export class CreateChannelDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(3)
    name?: string;

    @Min(0)
    @Max(2)
    type?: number;

    @ValidateIf(o => o.type === EChannelTypes.PROTECTED ) 
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    @MinLength(3)
    hash?: string;

}