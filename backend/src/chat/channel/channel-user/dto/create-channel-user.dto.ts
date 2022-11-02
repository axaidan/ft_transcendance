import { IsIn, IsInt } from "class-validator";
import { EChannelStatus } from "../types";

export class CreateChannelUserDto {

    @IsInt()
    userId: number;

    @IsInt()
    channelId: number;

    @IsInt()
    status: number;

    @IsInt()
    role: number;

}