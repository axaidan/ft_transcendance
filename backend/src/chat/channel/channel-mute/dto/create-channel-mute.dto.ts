import { IsDate, IsDateString, IsInt } from "class-validator";

export class CreateChannelMuteDto {

    @IsInt()
    userId: number;

    @IsInt()
    chanId: number;

    @IsDateString()
    expires: Date;

}