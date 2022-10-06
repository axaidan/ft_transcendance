import { IsInt } from "class-validator";

export class CreateDiscussionDto {

    @IsInt()
    user2Id: number;

}