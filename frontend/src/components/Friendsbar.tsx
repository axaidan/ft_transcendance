// Extern:
import React, { useContext, useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { Link } from 'react-router-dom';

// Intern:
import { DflUser, IUser } from '../types';
import { AxiosJwt } from '../hooks';
import SocketContextComponent from '../context/UserSocket/Components';
import { SocketContext } from '../context';

// Assets:
import '../styles/components/Friendsbar.css'
import '../styles/components/friendsbar_components/FooterFriend.css'
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

const colorStatus = (mode: number, cible: string, notifed: boolean) => {
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
function ContactStatus({ mode }: ContactStatusProps) {
	const statusTab: string[] = ['online', 'absent', 'inQueue', 'inGame', 'offline'];
	return (
		<div id={colorStatus(mode, "status", false)} className="contact-status">
			<div id="status-bulle">◉</div>
			{statusTab[mode]}
		</div>
	)
}

type ContactProps = { user: IUser, status: number };
function Contact({ user, status }: ContactProps) {

	// CECI SERA DONNE GRACE AU SOCKET STATUS
	const notif: number = 0;

	return (
		<li className='contact-container'>
			<img src='https://2.bp.blogspot.com/-sT67LUsB61k/Ul7ocxgFhTI/AAAAAAAACdc/iAQ2LgxMvG4/s1600/image+115.jpg' className="contact_icon" />
			<div className='contact-info'>
				<div id={colorStatus(status, 'username', notif ? true : false)} className="contact-name">
					{user.username}
				</div>
				<ContactStatus mode={status} />
			</div>
			{notif ?
				<div className='contact-notification'>
					{notif}
				</div> : <></>
			}
		</li>
	)
}

function OnlineFriends() {

	const axios = AxiosJwt();
	const [onlineFriend, setOnlineFriend] = useState<IUser[]>([]);


	const { users } = useContext(SocketContext).SocketState;



	useEffect(() => {
		axios.get('/relation/list_friend')
			.then((res: AxiosResponse<IUser[]>) => { setOnlineFriend(res.data) });
	}, []);

	useEffect(() => {
		console.log('users: ' + users);
	}, [users])


	const isOnline = ( uid: number, index: number, user: IUser ) => {

		if ( users.includes(uid)) {

			return (
				<Link key={index} className='no_decoration' to={""}>
					<Contact user={user} status={0}/>
				</Link> 
			)
		}
		else  (
			<></>
		)
	}

	const isOffline = ( uid: number, index: number, user: IUser ) => {

		if ( users.includes(uid) == false ) {

			return (
				<Link key={index} className='no_decoration' to={""}>
					<Contact user={user} status={4}/>
				</Link> 
			)
		}
		else  (
			<></>
		)
	}


	return (
		<ul id='contact-list'>
			{onlineFriend.map((user: IUser, index) => (
				isOnline( user.id, index, user )
			))}
			{onlineFriend.map((user: IUser, index) => (
				isOffline( user.id, index, user )
			))}

			{/* {online_friends.map((user: IUser, index) => (
				<Link key={index} className='no_decoration' to={""}>
					<Contact user={user} />
				</Link>
			))} */}
		</ul>
	)
}


function FooterFriendBar() {
	return (
		<div className="footer-friend">
			<button id='btn-footer-discussion'></button>
			<button id='btn-footer-mission'></button>
			<button></button>
			<div><p>V12.19</p></div>
			<button id='btn-footer-help'></button>
		</div>
	)
}

function ChatNav() {

	return (
		<div className='messages-nav'>
			<Contact user={DflUser} status={0} />
			<div className='messages-options'>
				<button id='btn-messages-reduction'></button>
				<button id='btn-messages-panel'></button>
			</div>
		</div>
	)
}

function DiscussionNav() {

	const axios = AxiosJwt();
	const [onlineFriend, setOnlineFriend] = useState<IUser[]>([]);

	useEffect(() => {
		axios.get('/user/all')
			.then((res: AxiosResponse<IUser[]>) => { setOnlineFriend(res.data) });
	});

	return (
		<div className='discussion-container'>
			{onlineFriend.map((user: IUser, index) => (
				<Contact user={user} status={0} />
			))}
		</div>
	)
}

function Chat() {
	return (
		<div className="chat-container">
			<DiscussionNav />
			<div className='messages-container'>
				<ChatNav />
				<div className='messages-body'></div>
				<input className="messages-input" placeholder='Tapez votre message ici...'/>
			</div>
		</div>
	)
}

// ****************************************************************** //
// ***************            FRIENDBAR             ***************** //
// ****************************************************************** //

type FriendbarProps = { userId: number; }
export function Friendsbar({ userId }: FriendbarProps) {

	return (
		<div className='Friendsbar'>
			<SocketContextComponent userId={userId}>
				<SocialOption />
				<OnlineFriends />
				<FooterFriendBar />
				<Chat />
			</SocketContextComponent>
		</div>
	);
};
