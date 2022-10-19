import { IsInt } from "class-validator";

export class CreateDiscussionDto {

    @IsInt()
    user1Id: number;

    @IsInt()
    user2Id: number;

}