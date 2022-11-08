import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class ChannelMessageDto {
    @IsInt()
    userId: number;

    @IsInt()
    chanId: number;

    @IsString()
    @IsNotEmpty()
    text: string;

}