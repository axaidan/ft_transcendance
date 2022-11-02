import { IsDate, IsInt } from "class-validator";

export class ChannelMuteDto {

    @IsInt()
    userId: number;

    @IsInt()
    chanId: number;

}