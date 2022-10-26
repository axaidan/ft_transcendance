import { DiscussionMessage } from "@prisma/client";
import { UserBasic } from "src/users/types/UserBasic";

export type DiscussionWithUsers = {
    id: number;
    user1Id: number;
    user2Id: number;
    user1: UserBasic;
    user2: UserBasic;
    messages: DiscussionMessage[];
};