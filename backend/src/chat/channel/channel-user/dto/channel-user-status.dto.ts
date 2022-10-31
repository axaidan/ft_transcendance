import { IsDate, IsInt, Max, Min } from "class-validator";

export class ChannelUserStatusDto {

    @IsInt()
    userId: number;

    @IsInt()
    @Min(0)
    @Max(2)
    status: number;

    @IsDate()
    statusTime: Date;

}