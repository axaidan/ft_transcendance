import { ChannelUser } from "@prisma/client";

export type ChanWusersWmsgsWstatus = {
    id: number;
    name: string;
    private: boolean;
    protected: boolean;
    channelUsers: ChannelUser[];
    // messages: ChannelMessages[];
    userJoined: boolean;
    userStatus: number;
    userRole: number;
}