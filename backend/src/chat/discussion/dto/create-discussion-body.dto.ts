import { IsInt } from "class-validator";

export class CreateDiscussionBodyDto {
    @IsInt()
    user2Id: number;
}