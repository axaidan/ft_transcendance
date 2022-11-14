// Extern:
import { AxiosResponse } from "axios";
import { PropsWithChildren, useContext, useEffect, useReducer, useState } from "react";

// Intern:
import { ChatSocketContextProvider, ChatSocketReducer, dflChatSocketContextState, EChatSocketActionType } from ".";
import { AxiosJwt } from "../../hooks";
import { useSocket } from "../../hooks/useSocket";
import { IChannel, IChannelMessage, IChannelSimple, IDiscussion, IMessage, IUserChannel } from "../../types";
import { SocketContext } from "../UserSocket";

import bg_website from '../../assets/videos/bg_website.webm'

export interface IChatSocketContextComponentProps extends PropsWithChildren { }
export const ChatSocketContextComponent: React.FunctionComponent<IChatSocketContextComponentProps> = ({ children }) => {
	const [ChatSocketState, ChatSocketDispatch] = useReducer(ChatSocketReducer, dflChatSocketContextState);
	const [loadingSocket, setLoading] = useState(true);
	const axios = AxiosJwt();

	const { me } = useContext(SocketContext).SocketState;

	const chatSocket = useSocket('localhost:3000/chatNs', {
		reconnectionAttempts: 5,
		reconnectionDelay: 5000,
		autoConnect: false,
	})

	useEffect(() => {
		chatSocket.connect();
		// Save the socket in context //
		ChatSocketDispatch({ type: EChatSocketActionType.UP_SOKET, payload: chatSocket });
		ChatSocketDispatch({ type: EChatSocketActionType.UP_UID, payload: me });

		// Start the envent listeners // 
		axios.get('/discussion')
			.then((res: AxiosResponse<IDiscussion[]>) => {
				ChatSocketDispatch({ type: EChatSocketActionType.GET_ALLDISC, payload: res.data });
			});

		axios.get('/channels/all')
			.then((res: AxiosResponse<IChannelSimple[]>) => {
				ChatSocketDispatch({ type: EChatSocketActionType.GET_ACHAN, payload: res.data });
			});

		axios.get('/channels')
			.then((res: AxiosResponse<IChannel[]>) => {
				ChatSocketDispatch({ type: EChatSocketActionType.GET_CHAN, payload: res.data });
			});

		StartListeners();
		StartHandshake();
	}, [])

	const StartListeners = () => {
		chatSocket.on('discMsgToClient', (message: IMessage) => {
			ChatSocketDispatch({ type: EChatSocketActionType.NEW_MSG, payload: message });
		});

		chatSocket.on('newDiscToClient', (disc: IDiscussion) => {
			ChatSocketDispatch({ type: EChatSocketActionType.UP_DISC, payload: disc });
		})

		// ---------------------------- // 
		//           CHANNELS           // 
		// ---------------------------- // 



		///////////////////
		//  CHAN EVENTS  //
		chatSocket.on('newChanToClient', (dto: { chan: IChannelSimple }) => {
			ChatSocketDispatch({ type: EChatSocketActionType.UP_ACHAN, payload: dto.chan });
		})
		chatSocket.on('upChanOwner', (dto: { chan: IChannel }) => {
			ChatSocketDispatch({ type: EChatSocketActionType.UP_CHAN, payload: dto.chan });
		})
		chatSocket.on('channelDeleted', (dto: { chanId: number }) => {
			ChatSocketDispatch({ type: EChatSocketActionType.RM_CHAN, payload: dto.chanId });
			ChatSocketDispatch({ type: EChatSocketActionType.RM_ACHAN, payload: dto.chanId });
		})
		chatSocket.on('chanMsgToClient', (chan: IChannelMessage) => {
			ChatSocketDispatch({ type: EChatSocketActionType.NEW_MSG_CHAN, payload: chan });
		})
		///////////////////


		////////////////////
		//  PATCH EVENTS  //
		chatSocket.on('channelTypeEdited', (dto: { chanId: number, type: number }) => {
			ChatSocketDispatch({ type: EChatSocketActionType.EDIT_TYPE_CHAN, payload: dto });
			if (dto.type != 0)
				ChatSocketDispatch({ type: EChatSocketActionType.RM_ACHAN, payload: dto.chanId });

		})
		chatSocket.on('channelNameEdited', (dto: { chanId: number, name: string }) => {
			ChatSocketDispatch({ type: EChatSocketActionType.EDIT_NAME_CHAN, payload: dto });
		})
		chatSocket.on('channelUserRoleEdited', (dto: IUserChannel) => {
			ChatSocketDispatch({ type: EChatSocketActionType.ROLE_CHAN, payload: dto });
		})
		////////////////////


		///////////////////
		//  USER EVENTS  //
		chatSocket.on('userLeaveChannel', (chan: IUserChannel) => {
			ChatSocketDispatch({ type: EChatSocketActionType.RM_USER_CHAN, payload: chan });
		})
		chatSocket.on('userJoinedChannel', (chan: { channelUser: IUserChannel }) => {
			ChatSocketDispatch({ type: EChatSocketActionType.NEW_USER_CHAN, payload: chan.channelUser });
		})
		chatSocket.on('invitedToChannel', (dto: { chan: IChannel }) => {
			ChatSocketDispatch({ type: EChatSocketActionType.UP_CHAN, payload: dto.chan });
		})
		///////////////////


		//////////////////
		//  BAN EVENTS  //
		chatSocket.on('channelUserBanned', (dto: { chanId: number, userId: number, user: { username: string } }) => {
			ChatSocketDispatch({ type: EChatSocketActionType.BAN_USER_CHAN, payload: dto });
			if (dto.userId == me.id)
				ChatSocketDispatch({ type: EChatSocketActionType.RM_CHAN, payload: dto.chanId });
		})

		chatSocket.on('channelUserUnbanned', (dto: { chanId: number, userId: number, user: { username: string } }) => {
			ChatSocketDispatch({ type: EChatSocketActionType.UNBAN_USER_CHAN, payload: dto });
		})
		//////////////////


		///////////////////
		//  MUTE EVENTS  //
		chatSocket.on('channelUserMuted', (dto: { chanId: number, userId: number }) => {
			ChatSocketDispatch({ type: EChatSocketActionType.MUTE_USER_CHAN, payload: dto });
		})

		chatSocket.on('channelUserUnmuted', (dto: { chanId: number, userId: number }) => {
			ChatSocketDispatch({ type: EChatSocketActionType.UNMUTE_USER_CHAN, payload: dto });
		})
		///////////////////




	};

	const StartHandshake = () => {
		chatSocket.emit('loginToServer', me.id);
		setLoading(false);
	};

	if (loadingSocket)
		return (
			<div>
				<video src={bg_website} playsInline autoPlay loop muted className='bg_video' />
			</div>
		);

	return (<ChatSocketContextProvider value={{ ChatSocketState, ChatSocketDispatch }}>
		{children}
	</ChatSocketContextProvider>);
}