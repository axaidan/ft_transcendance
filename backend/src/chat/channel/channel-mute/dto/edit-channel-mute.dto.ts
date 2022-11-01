import { IsDate, IsInt } from "class-validator";

export class EditChannelMuteDto {

    @IsInt()
    userId: number;

    @IsInt()
    chanId: number;

    @IsDate()
    expires: Date;

}