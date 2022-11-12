import { useContext, useState } from "react";
import { ChatSocketContext, EChatSocketActionType, IChannel, SocketContext } from "../../context";

import '../../styles/components/channel_components/Channel.css'
import { DflChannel, IUser } from "../../types";
import { ChatUser, UserCreateChat } from "../discussion_components";



export interface ChannelUserPannelBtnProps { title: string, logic: () => void }
export function ChannelUserPannelBtn({title, logic}:ChannelUserPannelBtnProps ) {
	
	// console.log(user)
	return (
		<div className="channel-user-pannel-btn" onClick={() => logic()!}>
			<p>{title}</p>
		</div>
	)
}

export interface ChannelUserPannelProps { mode:number, user:IUser }
export function ChannelUserPannel({ mode, user }:ChannelUserPannelProps) {

	const sendMessageLogic = () => {} // Fait grace 
	
	const goToProfileLogic = () => {
		console.log('LOGIC POUR GO TO PROFILE ' + user.login)	
	}
	
	const addAdminLogic = () => {
		console.log('LOGIC POUR ADD TO ADMIN ' + user.login)	
	}

	const BanUserLogic = () => {
		console.log('LOGIC POUR BAN USER ' + user.login)	
	}
	
	const MuteUserLogic = () => {
		console.log('LOGIC POUR MUTE USER ' + user.login)	
	}

	return (
		<div id="channel-user-pannel" className="red">
			{ mode <= 0 ? 
				<ChannelUserPannelBtn title={"Add Admin"} logic={addAdminLogic}/>
			: <></>}
			{ mode <= 1 ? <>
				<ChannelUserPannelBtn title={"Ban User"} logic={BanUserLogic}/>
				<ChannelUserPannelBtn title={"Mute User"} logic={MuteUserLogic}/>
			</> : <></>}
			<UserCreateChat user={user}>
				<ChannelUserPannelBtn title={"Send Message"} logic={sendMessageLogic}/>
			</UserCreateChat>
			<ChannelUserPannelBtn title={"Goto Profile"} logic={goToProfileLogic}/>
		</div>
	)
}

export function ChannelUser() {
	const { me } = useContext(ChatSocketContext).ChatSocketState;
	const [ display , setDisplay ] = useState(false);

	return (
		<div className="channel-user-box">
			<div className="channel-user" onClick={() => setDisplay(!display)}>
				<ChatUser user={me} msg={"#Owner"}/>
			</div>
			{ display ? <ChannelUserPannel mode={0} user={me} /> : <></>}
		</div>
	)
}

export function ChannelUserList() {
	// ICI JE RECUPERE LA LIST DES USER DUN CHANNEL

	return (
		<div>
			<ChannelUser />
			<ChannelUser />
			<ChannelUser />
			<ChannelUser />
		</div>
	)
}

interface ChannelOptionMenuProps { mode: number }
const ChannelOptionMenu = ({ mode }:ChannelOptionMenuProps ) => {
	const dispatch = useContext(ChatSocketContext).ChatSocketDispatch;
	const { settings_display } = useContext(ChatSocketContext).ChatSocketState;

	const ChannelSettingsLogic = () => {
		dispatch({ type: EChatSocketActionType.SETTING_CHAN, payload: !settings_display})
	}

	const ChannelDeleteLogic = () => {
		console.log('LOGIC POUR ERASE CHANNEL ');	
	}
	
	const ChannelLeaveLogic = () => {
		console.log('LOGIC POUR LEAVE CHANNEL ');	
	}

	return (
		<div id="channel-option-menu">
			{ !mode ? <>
				<ChannelOptionMenuBtn title="Settings" channel={null} logic={ChannelSettingsLogic}/>
				<ChannelOptionMenuBtn title="Delete" channel={null} logic={ChannelDeleteLogic}/>
			</> : 
				<ChannelOptionMenuBtn title="Leave" channel={null} logic={ChannelLeaveLogic}/>
			}
		</div>
	);
}

export interface ChannelOptionMenuBtnProps { title: string, channel: IChannel | null, logic: () => void }
export const ChannelOptionMenuBtn = ({title, channel, logic}:ChannelOptionMenuBtnProps ) => {
	return (
		<div className="channel-user-pannel-btn" onClick={() => logic()}>
			<p>{title}</p>
		</div>
	)
}

export function ChannelPannel() {
	const dispatch = useContext(ChatSocketContext).ChatSocketDispatch;
	function reduceChannel() { dispatch({ type: EChatSocketActionType.DISPLAY_CHAN, payload: false })}
	const [ display, setDisplay ] = useState<boolean>(false)

	return (
		<div id="channel-option">
			<button id='btn-messages-reduction' onClick={() => reduceChannel()} />
			<button id='btn-messages-panel' onClick={() => {setDisplay(!display)} } />
			{ display ? <ChannelOptionMenu mode={0}/> : <></> }
		</div>
	)
}

interface ChannelTitleProps { title: string }
export function ChannelTitle( {title}:ChannelTitleProps ) {

	const user = DflChannel;

	return (
		<div className="chat-user">	
			<div className="chat-user-avatar">
				<img src={user.avatarUrl} className="chat-user-icon" />
			</div>
			<div>
				<p id="chat-username">{title}</p>
				<p id="chat-user-origin">#EUW</p>
			</div>
		</div>
	)
}

export function ChannelHeader() {

	// IL ME FAUT ICI LE NOM DU CHANNEL POUR LE TITRE
	// IL ME FAUT AUSSI POUR LE PANNEL: ID ? 

	return (
		<div id="channel-header">
			<ChannelTitle title="Channel"/>
			<ChannelPannel />
		</div>
	)
}

export function ChannelMessages() {

	// var lastUserId: number = 0;

	const { me } = useContext(SocketContext).SocketState;
	const message_side = () => { return ((me.id != 0 ? "left" : "right")); }

	const ChanMessage = () => {
		return (
			<div className="chan-mess">
				{ me.id != 0 ? <p className="chan-mess-owner">{me.username}</p> : <></>}
				<div className={"message-" + message_side()}>
					<div id={"triangle-" + message_side()}></div>
					<p>awdawd</p>
				</div>
			</div>
		)
	}

	return (
		<div id="channel-message-body">
			<ChanMessage />
			<ChanMessage />
			<ChanMessage />
			<ChanMessage />
		</div>
	)
}

export function ChannelInput() {

	const handleKeyDown = (e: any) => {
		// const input = document.getElementById('messages-input') as HTMLInputElement;
		// if (e.key === 'Enter') {
		// 	if (input.value.length != 0) {socket!.emit('discMsgToServer', { discId: discussion[index_active].id, userId: me.id, text: input.value });}
		// 	input.value = "";
		// }
	} 										

	return (
		<input id="messages-input" placeholder='Tapez votre message ici...' onKeyDown={handleKeyDown} />
	)
}

export function ChannelSettings() {

	return (
		<div>
			SETTINGS
		</div>
	)
}

export function ChannelBody() {
	const { settings_display } = useContext(ChatSocketContext).ChatSocketState;

	return (
		<div id="channel-body">
			<ChannelHeader />
			{ settings_display ? <ChannelSettings />	: <ChannelMessages /> }
			{ settings_display ? <></>					: <ChannelInput /> }
		</div>
	)
}

export function Channel() {
	const { channel_display } = useContext(ChatSocketContext).ChatSocketState;

	return (
		<div id={channel_display ? "channel-container-display" : "channel-container-none"}>
			<ChannelUserList />
			<ChannelBody />
		</div>
	)
}