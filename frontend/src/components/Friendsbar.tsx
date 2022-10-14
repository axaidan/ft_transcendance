// Extern:
import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { Link } from 'react-router-dom';

// Intern:
import { IUser } from '../types';
import { AxiosJwt } from '../hooks';
import SocketContextComponent from '../context/Components';

// Assets:
import '../styles/components/Friendsbar.css'
import '../styles/components/friendsbar_components/SocialOption.css'
import '../styles/components/friendsbar_components/Contact.css'

// ****************************************************************** //
// ***************          SOCIAL OPTION           ***************** //
// ****************************************************************** //

function SocialOption() {
	return (
		<div className='social-option'>
			<div>
				<p id="social-title">SOCIAL</p>
			</div>
			<div>
				<button id='social-add' className="social-btn"></button>
				<button id='social-sort' className="social-btn"></button>
				<button id='social-search' className="social-btn"></button>
			</div>
		</div>
	)
}

enum Status {
	ONLINE,
	ABSENT,
	INQUEUE,
	INGAME,
	OFFLINE
}

const colorStatus = ( mode:number, cible:string, notifed: boolean) => {
	switch (cible) {
		case "status":
			switch (mode) {
				case Status.ONLINE:
					return ('contact-color-online');
				case Status.ABSENT:
					return ('contact-color-occuped');
				case Status.INGAME:
					return ('contact-color-ongame');
				case Status.INQUEUE:
					return ('contact-color-ongame');
				case Status.OFFLINE:
					return ('contact-color-offline');
			}
		case "username":
			if (notifed)
				return ('contact-color-notified');
			switch (mode) {
				case Status.OFFLINE:
					return ('contact-color-offline');
				default:
					return ('contact-color-username');
			}
		case "border":
			return (mode === Status.OFFLINE ? 
					'contact-color-offline' : 'contact-color-online');
	}
	return ("")
}

// ****************************************************************** //
// ***************        CONTACT FRIENDBAR         ***************** //
// ****************************************************************** //
type ContactStatusProps = { mode: number };
function ContactStatus({ mode }:ContactStatusProps) {
	const statusTab:string[] = [ 'online', 'absent', 'inQueue', 'inGame', 'offline'];
	return (
		<div id={colorStatus(mode, "status", false)} className="contact-status">
			<div id="status-bulle">◉</div>
			{ statusTab[mode] }
		</div>
	)
}

type ContactProps = { user: IUser };
function Contact({ user }:ContactProps) {

	// CECI SERA DONNE GRACE AU SOCKET STATUS
	const status = Status.INQUEUE;
	const notif: number = 1;

	return (
		<li className='contact-container'>
			<img src='https://2.bp.blogspot.com/-sT67LUsB61k/Ul7ocxgFhTI/AAAAAAAACdc/iAQ2LgxMvG4/s1600/image+115.jpg' className="contact_icon" />
			<div className='contact-info'>
				<div id={colorStatus(status, 'username', notif ? true : false )} className="contact-name">
					{user.username}
				</div>
				<ContactStatus mode={status}/>
			</div>
			{ notif ?
			<div className='contact-notification'>
				{ notif }
			</div> : <></>
			}


		</li>
	)
}

type OnlineFriendProps = { online_friends: IUser[]; }
function OnlineFriends({online_friends}:OnlineFriendProps) {
	return (
		<ul id='contact-list'>
			{ online_friends.map(( user: IUser ) => (
				<Link className='no_decoration' to={""}>
					<Contact user={user} />
				</Link>
			))}
		</ul>
	)
}

// ****************************************************************** //
// ***************            FRIENDBAR             ***************** //
// ****************************************************************** //

type FriendbarProps = { userId: number; }
export function Friendsbar({ userId }: FriendbarProps) {

	const axios = AxiosJwt();
	const [ onlineFriend, setOnlineFriend ] = useState<IUser[]>([]);

	useEffect(() => {
		axios.get('/relation/list_friend')
		.then( (res: AxiosResponse<IUser[]>) => { setOnlineFriend(res.data)} );
	});

	return (
		<div className='Friendsbar'>
			<SocketContextComponent>
				<SocialOption />
				<OnlineFriends online_friends={onlineFriend} />
				{/* <OurChannel online_friends={onlineFriend} />
				<FooterFriendBar online_friends={onlineFriend} /> */}
			</SocketContextComponent>
		</div>
	);
};
