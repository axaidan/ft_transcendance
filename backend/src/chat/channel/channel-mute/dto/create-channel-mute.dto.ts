import { IsDate, IsInt } from "class-validator";

export class CreateChannelMuteDto {

    @IsInt()
    userId: number;

    @IsInt()
    chanId: number;

    @IsDate()
    expires: Date;

}