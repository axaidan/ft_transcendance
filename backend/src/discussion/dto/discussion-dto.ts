import { IsInt } from "class-validator";

export class DiscussionDto {

    @IsInt()
    user2Id: number;

}