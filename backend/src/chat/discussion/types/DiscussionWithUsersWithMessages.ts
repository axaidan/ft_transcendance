import { DiscussionMessage, User } from "@prisma/client"
import { DiscussionMessageBasic } from "src/chat/discussion-message/types/DiscussionMessageBasic";
import { UserBasic } from "src/users/types/UserBasic";

export type DiscussionWithUsersWithMessages = {
    id: number;
    user1Id: number;
    user2Id: number;
    user1: UserBasic;
    user2: UserBasic;
    messages: DiscussionMessageBasic[];
};