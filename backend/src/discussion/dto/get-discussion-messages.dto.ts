import { Discussion, DiscussionMessage } from "@prisma/client";
import { IsArray, IsInt } from "class-validator";

export class GetDiscussionMessagesDto {

    @IsInt()
    discId: number;

    @IsArray()
    messages: DiscussionMessage[];

}