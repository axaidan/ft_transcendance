
import { useContext } from "react";
import { Resolver, useForm } from "react-hook-form";

import { ChatSocketContext, SocketContext } from "../context";

import "../styles/pages/Channels.css"
import { useState } from 'react';
import { AxiosJwt } from '../hooks/AxiosJwt';
import { IChannelSimple } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";


export type ChannelForm = {
	name: string;
	type: string;
	hash?: string;
	confirmhash?: string;
}

export type ICreateChannel = {
	name: string;
	type: number;
	hash?: string;
}

export const DflCreateChannel: ICreateChannel = {
	name: '',
	type: 0,
}

type ChannelPassword = {
	password: string;
}

export function ChannelFromCreate() {

	const [typeForm, setTypeForm] = useState<string>("0");
	const regex = new RegExp('[`~@#$%&{};\'"<>.,/?:+=]');
	const axios = AxiosJwt();
	const { me } = useContext(SocketContext).SocketState;

	const resolver: Resolver<ChannelForm> = async (values) => {


		return {
			values: values.name ? values : {} && values.type !== '2' ? values.hash === '' && values.confirmhash === '' : {},
			errors: !values.name
				? {
					name: {
						type: 'required',
						message: 'Enter a name for your channel',
					},
				}
				: {}
					&&
					(values.name.length < 3) ?
					{
						name: {
							type: 'required',
							message: 'You must have at least 3 characters.',
						}
					}
					: {}
						&&
						(regex.test(values.name)) ?
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


	const { register, handleSubmit, reset, formState: { errors } } = useForm<ChannelForm>({ resolver });

	const onSubmit = handleSubmit((data) => {
		const dto = DflCreateChannel;
		dto.name += data.name;
		dto.type += parseInt(data.type);
		if (data.hash !== '')
			dto.hash = data.hash;
		axios.post('/channel/', dto);
		axios.post('/achiv/unlock', { userId: me.id, achivId: 10 });
	});

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		reset({
			hash: '',
			confirmhash: '',
		});
		setTypeForm(event.target.value)
	}



	return (
		<div id="channel-page-form-create">
			<div className="channel-form-create-title">
				Create a channel
			</div>
			<form onSubmit={onSubmit}>
				<div className="channel-form-create-kit">
					<div className="channel-input-div">
						<input {...register("name")} placeholder="Channel's name..." maxLength={20} className={errors.name ? 'channel-create-error' : 'channel-create-input'} />
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
									<input {...register("confirmhash")} placeholder="Confirm Password..." maxLength={15} type="password" className={errors.confirmhash ? 'channel-hash-input-error' : 'channel-hash-input'} />
								</div>
								{errors?.confirmhash && <p id='create-channel-error-hash'>{errors.confirmhash.message}</p>}
							</div>
							: <></>
					}
					<div className="channel-validation-button">
						<button onClick={onSubmit} className='channel-create-validate'>Create</button>
					</div>
				</div>
			</form>
		</div>
	)
}



export function ChannelFromJoin() {

	return (
		<div id="channel-page-form-join">b</div>
	)
}


// export interface ChannelJoinLogicProps extends PropsWithChildren { chan: IChannel };
// export const ChannelJoinLogic: React.FunctionComponent<ChannelJoinLogicProps> = ({ children, chan }) => {

// 	// ICI FAIRE LA LOGIC POUR JOIN UN CHANNEL


// 	return (
// 		<div onClick={() => { console.log(chan.name) }}>
// 			{ children }
// 		</div>
// 	);
// }

export interface ChannelPublicProps { chan: IChannelSimple }
export function ChannelPublic({ chan }: ChannelPublicProps) {

	const [pwd, setPwd] = useState<boolean>(false)
	const axios = AxiosJwt();

	const joinProtectedChannel = () => {
		setPwd(!pwd);
	}

	const resolver: Resolver<ChannelPassword> = async (values) => {


		return {
			values: values.password ? values : {},
			errors: !values.password
				? {
					password: {
						type: 'required',
						message: 'Enter a new password or cancel.',
					},
				}
				: {}
		};
	}

	const { register, handleSubmit, reset, formState: { errors } } = useForm<ChannelPassword>({ resolver });

	const onSubmit = handleSubmit((data) => {
		axios.post('/channel/' + chan.id + '/join', data)
		setPwd(false);
	});

	const Join = () => {
		axios.post('/channel/' + chan.id + '/join')
		setPwd(false);
	};

	return (
		<div className="channel-pp">
			<h2>
				{
					chan.type === 2 ?
						<FontAwesomeIcon icon={faLock} id='icon_unlocked' />
						:
						<></>
				}
				{chan.name}
			</h2>
			{
				chan.type === 2 ?
					<button onClick={joinProtectedChannel} id={pwd ? 'channel-disable' : 'channel-join-protected-btn'} ></button>

					: <button onClick={Join} id='channel-join-btn' ></button>
			}
			{
				pwd ?
					<div>
						<form onSubmit={onSubmit} className={pwd ? "channel-join-password" : "channel-join-disabled"}>
							<div className="user-input-kit">
								<input {...register("password")} placeholder='Password' maxLength={20} type="password" id='channel-join-pwd-input' />
								<button onClick={onSubmit} id='channel-join-btn' />
								<button onClick={() => setPwd(!pwd)} id='channel-join-cancel-btn'></button>
							</div>
							{errors?.password && <p id='user-error-input'>{errors.password.message}</p>}
						</form>
					</div>

					: <></>
			}
		</div>
	)
}

export function ChannelPublicList() {

	const { allChannels } = useContext(ChatSocketContext).ChatSocketState;

	return (
		<div>
			<div className="channel-join-title">
				<h1>JOIN PUBLIC CHANNELS:</h1>
			</div>
			<div id="channel-public-list">
				{allChannels.map((chan, index) => {
					return (
						// <ChannelJoinLogic chan={chan} key={index}> 
						<ChannelPublic chan={chan} key={index} />
						// </ChannelJoinLogic>
					)
				})

				}
			</div>
		</div>
	)
}


export function Channel() {
	return (
		<div id="channel-page">
			<div id="channel-page-froms">
				<ChannelFromCreate />
			</div>
			<ChannelPublicList />
		</div>
	)
}