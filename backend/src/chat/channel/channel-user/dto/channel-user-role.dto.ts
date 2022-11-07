import { IsInt, Max, Min } from "class-validator";

export class ChannelUserRoleDto {

    @IsInt()
    chanId: number;

    @IsInt()
    userId: number;

    @IsInt()
    @Min(0)
    @Max(2)
    role: number;

}