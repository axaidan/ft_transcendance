import { ChannelUser } from "@prisma/client";

export type ChanWusersWmsgs = {
    id: number;
    name: string;
    private: boolean;
    protected: boolean;
    channelUsers: ChannelUser[];
    // messages: ChannelMessages[];
}