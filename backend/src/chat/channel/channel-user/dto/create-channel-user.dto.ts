import { IsIn, IsInt } from "class-validator";
import { EChannelStatus } from "../types";

export class CreateChannelUserDto {

    @IsInt()
    userId: number;

    @IsInt()
    chanId: number;

    // @IsInt()
    // status: number;

    @IsInt()
    role: number;

}