import { IsInt } from "class-validator";

export class GetDiscussionDto {

    @IsInt()
    discId: number;

}