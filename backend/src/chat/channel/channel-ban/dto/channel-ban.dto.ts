import { IsDate, IsInt } from "class-validator";

export class ChannelBanDto {

    @IsInt()
    userId: number;

    @IsInt()
    chanId: number;

}