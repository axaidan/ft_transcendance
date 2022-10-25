import { IsBoolean, IsInt } from "class-validator";

export class OnlineStatusDto {
    
    @IsInt()
    userId: number;

    @IsBoolean()
    onlineStatus: boolean;

}