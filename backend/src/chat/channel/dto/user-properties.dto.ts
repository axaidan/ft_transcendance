import { IsBoolean, IsInt, Max, Min } from "class-validator";

export class UserPropetiesDto {

    @IsInt()
    @Min(0)
    @Max(3)
    status: number;

    @IsInt()
    @Min(0)
    @Max(3)
    role: number;

    @IsBoolean()
    joined: boolean;

}