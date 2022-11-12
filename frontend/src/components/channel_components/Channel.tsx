import { useContext, useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ChatSocketContext, EChatSocketActionType, SocketContext } from "../../context";
import { AxiosJwt } from "../../hooks";
import { ChannelForm, DflCreateChannel } from "../../pages";

import '../../styles/components/channel_components/Channel.css'
import { DflChannel, IUser, IUserChannel, IChannel, IChannelMessage } from "../../types";
import { ChatUser, UserCreateChat } from "../discussion_components";



export interface ChannelUserPannelBtnProps { title: string, logic: () => void }
export function ChannelUserPannelBtn({ title, logic }: ChannelUserPannelBtnProps) {
	return (
		<div className="channel-user-pannel-btn" onClick={() => logic()!}>
			<p>{title}</p>
		</div>
	)
}

export interface ChannelUserPannelProps { mode: number, user: IUserChannel }
export function ChannelUserPannel({ mode, user }: ChannelUserPannelProps) {

	const { index_channel, channels } = useContext(ChatSocketContext).ChatSocketState;
	const dispatch = useContext(ChatSocketContext).ChatSocketDispatch;

	const curr_channel = channels[index_channel];
	const navigate = useNavigate();
	const axios = AxiosJwt();

	const sendMessageLogic = () => {
		dispatch({ type: EChatSocketActionType.DISPLAY_CHAN, payload: false })
	}

	const goToProfileLogic = () => {
		navigate('/home/' + user.user.id)
	}

	// ----------------------------------------------------------------------------------------------------------------------- PROBLEME
	const addAdminLogic = async () => {
		await axios.patch('/channel/' + curr_channel.id + '/user/' + user.userId + '/1')
	}

	// ----------------------------------------------------------------------------------------------------------------------- PROBLEME
	const rmAdminLogic = async () => {
		await axios.patch('/channel/' + curr_channel.id + '/user/' + user.userId + '/2')
	}

	const BanUserLogic = () => {
		console.log('LOGIC POUR BAN USER ' + user.user.login)
	}

	// const unBanUserLogic = () => {
	// 	console.log('LOGIC POUR UNBAN USER ' + user.user.login)	
	// }

	const MuteUserLogic = () => {
		console.log('LOGIC POUR MUTE USER ' + user.user.login)
	}

	// const unMuteUserLogic = () => {
	// 	console.log('LOGIC POUR UNMUTE USER ' + user.user.login)	
	// }

	const role = user.role;

	return (
		<div id="channel-user-pannel">
			{mode <= 0 ?
				(role == 2 ? <ChannelUserPannelBtn title={"Grade Up"} logic={addAdminLogic} /> : <ChannelUserPannelBtn title={"Grade Down"} logic={rmAdminLogic} />)
				: <></>}
			{mode <= 1 ? <>
				<ChannelUserPannelBtn title={"Ban User"} logic={BanUserLogic} />
				<ChannelUserPannelBtn title={"Mute User"} logic={MuteUserLogic} />
			</> : <></>}
			<UserCreateChat user={user.user}>
				<ChannelUserPannelBtn title={"Send Message"} logic={sendMessageLogic} />
			</UserCreateChat>
			<ChannelUserPannelBtn title={"Goto Profile"} logic={goToProfileLogic} />
		</div>
	)
}

export interface ChannelUserProps { user: IUserChannel }
export function ChannelUser({ user }: ChannelUserProps) {
	const [display, setDisplay] = useState(false);
	const { index_channel, channels, me } = useContext(ChatSocketContext).ChatSocketState;

	const getRoleTitle = (): string => {
		return (user.role == 0 ? "#Owner" : user.role == 1 ? "#Admin" : "#Member");
	}

	function getMyRole() {
		const role: number | undefined = channels[index_channel].users.find((user) => { return user.userId == me.id })?.role
		return role;
	}

	return (
		<div className="channel-user-box">
			<div className="channel-user" onClick={() => { if (me.id != user.userId) setDisplay(!display) }}>
				<ChatUser user={user.user} msg={getRoleTitle()} />
			</div>
			{display ? <ChannelUserPannel mode={getMyRole()!} user={user} /> : <></>}
		</div>
	)
}


export interface ChannelUserListProps { users: IUserChannel[] }
export function ChannelUserList({ users }: ChannelUserListProps) {
	return (
		<div>
			{users.map((user, index) => {
				return <ChannelUser key={index} user={user} />
			})}
		</div>
	)
}

interface ChannelOptionMenuProps { mode: number }
const ChannelOptionMenu = ({ mode }: ChannelOptionMenuProps) => {
	const dispatch = useContext(ChatSocketContext).ChatSocketDispatch;
	const { settings_display, channels, index_channel } = useContext(ChatSocketContext).ChatSocketState;
	const axios = AxiosJwt()
	const curr_channel = channels[index_channel];

	const ChannelSettingsLogic = () => {
		dispatch({ type: EChatSocketActionType.SETTING_CHAN, payload: !settings_display })
	}

	// ----------------------------------------------------------------------------------------------------------------------- PROBLEME
	const ChannelDeleteLogic = () => {
		console.log('LOGIC POUR ERASE CHANNEL ');
		axios.delete('/channel/' + curr_channel.id);
	}

	const ChannelLeaveLogic = () => {
		axios.post('/channel/' + curr_channel.id + '/leave');
		dispatch({ type: EChatSocketActionType.RM_CHAN, payload: curr_channel.id });
	}

	return (
		<div id="channel-option-menu">
			{!mode ? <>
				<ChannelOptionMenuBtn title="Settings" logic={ChannelSettingsLogic} />
				<ChannelOptionMenuBtn title="Delete" logic={ChannelDeleteLogic} />
			</> :
				<ChannelOptionMenuBtn title="Leave" logic={ChannelLeaveLogic} />
			}
		</div>
	);
}

export interface ChannelOptionMenuBtnProps { title: string, logic: () => void }
export const ChannelOptionMenuBtn = ({ title, logic }: ChannelOptionMenuBtnProps) => {
	return (
		<div className="channel-user-pannel-btn" onClick={() => logic()}>
			<p>{title}</p>
		</div>
	)
}

export function ChannelPannel() {
	const dispatch = useContext(ChatSocketContext).ChatSocketDispatch;
	function reduceChannel() { dispatch({ type: EChatSocketActionType.DISPLAY_CHAN, payload: false }) }
	const { index_channel, channels, me } = useContext(ChatSocketContext).ChatSocketState;
	const [display, setDisplay] = useState<boolean>(false)

	function getMyRole() {
		const role: number | undefined = channels[index_channel].users.find((user) => { return user.userId == me.id })?.role
		return role;
	}

	return (
		<div id="channel-option">
			<button id='btn-messages-reduction' onClick={() => reduceChannel()} />
			<button id='btn-messages-panel' onClick={() => { setDisplay(!display) }} />
			{display ? <ChannelOptionMenu mode={getMyRole()!} /> : <></>}
		</div>
	)
}

interface ChannelTitleProps { title: string }
export function ChannelTitle({ title }: ChannelTitleProps) {

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

export function ChannelHeader({ chan }: ChannelBodyProps) {

	// IL ME FAUT ICI LE NOM DU CHANNEL POUR LE TITRE
	// IL ME FAUT AUSSI POUR LE PANNEL: ID ? 

	return (
		<div id="channel-header">
			<ChannelTitle title={chan.name.toUpperCase()} />
			<ChannelPannel />
		</div>
	)
}

export interface ChannelMessagesProps { messages: IChannelMessage[] }
export function ChannelMessages({ messages }: ChannelMessagesProps) {

	// var lastUserId: number = 0;

	const { me } = useContext(SocketContext).SocketState;

	interface ChanMessageProps { message: IChannelMessage }
	const ChanMessage = ({ message }: ChanMessageProps) => {

		const message_side = () => { return ((me.id != message.userId ? "left" : "right")); }

		return (
			<div className="chan-mess">
				{me.id != message.userId ? <p className="chan-mess-owner">{message.user.username}</p> : <></>}
				<div className={"message-" + message_side()}>
					<div id={"triangle-" + message_side()}></div>
					<p>{message.text}</p>
				</div>
			</div>
		)
	}

	return (
		<div id="channel-message-body">
			<p id='messages-careful2'>N'oubliez pas que notre equipe transendence ne vous demandera jamais votre mot de passe pour vous aider.</p>
			{messages.map((message, index) => {
				return <ChanMessage key={index} message={message} />
			})}
		</div>
	)
}

export function ChannelInput() {
	const { socket, channels, index_channel, me } = useContext(ChatSocketContext).ChatSocketState;

	const handleKeyDown = (e: any) => {
		const input = document.getElementById('channel-input') as HTMLInputElement;
		if (e.key === 'Enter') {
			if (input.value.length != 0) { socket!.emit('chanMsgToServer', { chanId: channels[index_channel].id, userId: me.id, text: input.value }); }
			input.value = "";
		}
	}
	return (
		<input id="channel-input" placeholder='Tapez votre message ici...' onKeyDown={handleKeyDown} />
	)
}

export function ChannelSettings() {

	const { socket, channels, index_channel, me } = useContext(ChatSocketContext).ChatSocketState;

	type ChannelEditForm = {
		name?: string;
		type?: string;
		hash?: string;
		confirmhash?: string;
	}

	type IEditChannel = {
		name?: string;
		type?: number;
		hash?: string;
	}

	const DflEditChannel: IEditChannel = {
		type: channels[index_channel].type
	}

	const [typeForm, setTypeForm] = useState<string>(channels[index_channel].type.toString());
	const [pwd, setPwd] = useState<string>("");
	const regex = new RegExp('[`~@#$%&{};\'"<>.,/?:+=]');
	const axios = AxiosJwt();

	const resolver: Resolver<ChannelEditForm> = async (values) => {


		return {
			values: values.name ? values : {} && values.type !== '2' ? values.hash === '' && values.confirmhash === '' : {},
			errors:
				(values.name && values.name.length < 3) ?
					{
						name: {
							type: 'required',
							message: 'You must have at least 3 characters.',
						}
					}
					: {}
						&&
						(values.name && regex.test(values.name)) ?
						{
							name: {
								type: 'required',
								message: 'Bad expression (don\'t use: `~@#$%&{};\'"<>.,/?:+=)',
							}
						}
						: {}
							&&
							(values.type === '2' && !values.hash) ?
							{
								hash: {
									type: 'required',
									message: 'You should enter a password',
								}
							}
							: {}
								&&
								(values.type === '2' && values.confirmhash !== values.hash) ?
								{
									confirmhash: {
										type: 'required',
										message: 'Password does not match'
									}
								}
								: {}
									&&
									(values.type === '2' && values.hash && values.hash?.length < 3) ?
									{
										hash: {
											type: 'required',
											message: 'Password must have at least 3 characters.',
										}
									}
									: {}
		};
	};


	const { register, handleSubmit, reset, formState: { errors } } = useForm<ChannelEditForm>({ resolver });

	const onSubmit = handleSubmit((data) => {
		console.log(data);
		let dto: IEditChannel = DflEditChannel;
		if (data.name)
			dto.name = data.name;
		dto.type = parseInt(typeForm);
		if (pwd !== '')
			dto.hash = pwd;
		console.log(dto);
		axios.patch('/channel/' + channels[index_channel].id, dto);
		location.reload();
	});

	const onSubmitDelete = () => {
		axios.delete('/channel/' + channels[index_channel].id);
		location.reload();
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTypeForm(event.target.value)
	}

	const handleChangePwd = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPwd(event.target.value)
	}

	return (
		<div className="channel-owner-settings">
			<form onSubmit={onSubmit}>
				<div className="channel-settings-title">
					Channel's settings
				</div>
				<div className="channel-form-create-kit">
					<div className="channel-change-name">
						Change your channel's name
					</div>
					<div className="channel-input-div">
						<input {...register("name")} placeholder={channels[index_channel].name + '...'} maxLength={20} className={errors.name ? 'channel-create-error' : 'channel-create-input'} />
					</div>
					{errors?.name && <p id='channel-create-input-error'>{errors.name.message}</p>}
					<div className="channel-visibility-buttons">
						<div>
							<label>
								<input {...register("type")} type="radio" className="channel-create-public" value="0" onChange={handleChange} checked={typeForm === "0"} maxLength={20} />
								Public
							</label>
						</div>
						<div>
							<label>
								<input {...register("type")} type="radio" className="channel-create-protected" value="2" onChange={handleChange} checked={typeForm === "2"} maxLength={20} />
								Protected
							</label>
						</div>
						<div>
							<label>
								<input {...register("type")} type="radio" className="channel-create-private" value="1" onChange={handleChange} checked={typeForm === "1"} maxLength={20} />
								Private
							</label>
						</div>
					</div>
					{
						typeForm === '2' ?
							<div className="channel-create-pwd">
								<div className="pwd-title">
									Choose your password :
								</div>
								<div className="channel-choose-pwd">
									<input {...register("hash")} placeholder="Password..." maxLength={15} type="password" className={errors.hash ? 'channel-hash-input-error' : 'channel-hash-input'} />
								</div>
								{errors?.hash && <p id='create-channel-error-hash'>{errors.hash.message}</p>}
								<div className="pwd-title">
									Confirm your password :
								</div>
								<div className="channel-choose-pwd">
									<input {...register("confirmhash")} placeholder="Confirm Password..." maxLength={15} type="password" className={errors.confirmhash ? 'channel-hash-input-error' : 'channel-hash-input'} onChange={handleChangePwd} />
								</div>
								{errors?.confirmhash && <p id='create-channel-error-hash'>{errors.confirmhash.message}</p>}
							</div>
							: <></>
					}
					<div className="channel-settings-button">
						<div className="channel-apply-settings">
							<button onClick={onSubmit} className='channel-create-validate'>Apply modifications</button>
						</div>
						<div className="channel-delete-settings">
							<button onClick={onSubmitDelete} id='channel-delete-validate'>DELETE</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	)
}

export interface ChannelBodyProps { chan: IChannel }
export function ChannelBody({ chan }: ChannelBodyProps) {
	const { settings_display } = useContext(ChatSocketContext).ChatSocketState;

	return (
		<div id="channel-body">
			<ChannelHeader chan={chan} />
			{settings_display ? <ChannelSettings /> : <ChannelMessages messages={chan.messages} />}
			{settings_display ? <></> : <ChannelInput />}
		</div>
	)
}

export function Channel() {
	const { channel_display, index_channel, channels } = useContext(ChatSocketContext).ChatSocketState;

	if (index_channel < 0) return <></>
	const chan: IChannel | undefined = channels.at(index_channel);
	if (chan == undefined) return <></>

	return (
		<div id={channel_display ? "channel-container-display" : "channel-container-none"}>
			<ChannelUserList users={chan.users} />
			<ChannelBody chan={chan} />
		</div>
	)
}